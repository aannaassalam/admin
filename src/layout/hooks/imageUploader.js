import moment from "moment/moment";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

export default async function imageUploader(images, id) {
  const locImages = [];
  for (let i = 0; i < images.length; i++) {
    var image = images[i];
    var imageObject = {};
    if (typeof image.image === "string") {
      imageObject = image;
    } else {
      const imagesRef = ref(
        getStorage(),
        `/images used/${id}/${moment(new Date()).format("x")}.jpg`
      );
      const snapshot = await uploadBytes(imagesRef, image.image);
      const url = await getDownloadURL(snapshot.ref);
      imageObject = { image: url, id: image.id };
    }
    locImages.push(imageObject);
  }
  return locImages;
}
