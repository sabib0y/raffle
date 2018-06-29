import fire from '../fire';

export default function getPosts(item) {
  let collectedData = [];
  let randomizedData = [];
  fire.database().ref(item).once('value').then((snapshot) => {
    if (Object.entries !== null || Object.entries !== undefined) {
      let receivedData = Object.entries(snapshot.val());
      receivedData.map(item => {
        collectedData.push(item[1].user)
      });
    }
    if (collectedData.length > 0) {
      let randomIndex = Math.floor(Math.random() * collectedData.length);
      let randomElement = collectedData[randomIndex];
      randomizedData.push(randomElement);
    } else {
      console.error('No Entries Found', randomizedData)
    }
    return randomizedData;
  });
}