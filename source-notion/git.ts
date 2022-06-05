import { exec } from 'child_process';

export async function commitAll(): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log("Committing all changes...");

        exec('git add . && git commit -m "update"', (err, stdout, stderr) => {
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

        exec('git push', (err, stdout, stderr) => {
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