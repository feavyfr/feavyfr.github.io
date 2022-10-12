import { exec } from 'child_process';

export async function commitAll(): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log("Committing all changes...");

        const script =
            "git add . && git commit -m 'Push generated content [skip ci]' && git status";

        exec(script, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                reject();
                return;
            }
            if (stderr) {
                console.log(stderr);
            }
            console.log(stdout);
            resolve();
        });
    });
}

export async function push() {
    return new Promise<void>((resolve, reject) => {
        console.log("Pushing changes to remote...");

        exec('git push --force origin main', (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                reject();
                return;
            }
            console.log(stdout);
            resolve();
        });
    });
}