import { exec } from 'child_process';

export async function commitAll(): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log("Committing all changes...");
        // git remote update &&"
        // + "git fetch &&"
        // + "git reset --hard origin/main &&"
        // + "git config --local user.email 'gatsby-notion' &&"
        // + "git config --local user.name 'gatsby-notion' &&"
        // + "git add . &&"
        // + "git commit -m 'Push generated content [skip ci]'
        const script =
            "git add . && git commit -m 'Push generated content [skip ci]' && git status";

        exec(script, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                reject();
                return;
            }
            console.log(stdout);
            resolve(null);
        });
    });
}

export async function push() {
    return new Promise((resolve, reject) => {
        console.log("Pushing changes to remote...");

        exec('git push --force origin main', (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                reject();
                return;
            }
            console.log(stdout);
            resolve(null);
        });
    });
}