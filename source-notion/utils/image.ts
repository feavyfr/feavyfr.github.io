import fs from "fs";
import downloadFile from "download";
import imageType from "image-type";

export default async function downloadImage(url: string, dir: string, filename: string) {
    const data = await downloadFile(url);
    if (!data) {
        throw new Error("Failed to download image " + url);
    }
    const ext = imageType(data)!.ext;

    fs.writeFileSync(`${dir}/${filename}.${ext}`, data);
    console.log(`Successfully downloaded ${dir}/${filename}.${ext}`);
    return `${filename}.${ext}`;
}