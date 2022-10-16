import * as React from "react"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"

const PushPage = () => {
  const [token, setToken] = React.useState((typeof window !== "undefined" && localStorage.getItem("token")) || "");
  const [message, setMessage] = React.useState("")

  async function pushArticles() {
    const rep = await fetch("https://api.github.com/repos/Feavy/feavyfr/actions/workflows/publish-articles.yml/dispatches", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        "ref": "main"
      })
    });
    const ok = rep.ok;
    if(!ok) {
      const data: any = await rep.json();
      setMessage("Erreur lors de l'envoi de la requête : " + data.message);
      return;
    }
    localStorage.setItem("token", token);
    window.location.href = "/";
  }

  const updateToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  return (
      <Layout>
        <Helmet>
          <title>Push articles</title>
        </Helmet>
        <input type="password" id="token" placeholder="GitHub token" value={token} onInput={updateToken}/>
        <button onClick={pushArticles}>PUSH</button>
        <p>{message}</p>
      </Layout>
  )
}

export default PushPage
