const download = require("download");

const url = "https://www.creativefabrica.com/wp-content/uploads/2021/06/12/mountain-landscape-illustration-design-b-Graphics-13326021-1.jpg";

let filename = url.replace(/https?:\/\//, "");
filename = filename.substring(filename.indexOf("/")+1);
filename = filename.replace(/\//g, "-");
console.log(filename);

(async () => {
    await download(url, "/src/images/"+filename);
    console.log("download complete");
})();