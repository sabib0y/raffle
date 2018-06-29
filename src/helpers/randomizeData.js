import collectedData from './getDataFirebase';

export default function randomizeData() {
  let receivedData = [];
  let randomizedData = [];

    if (collectedData() > 0) {
      receivedData.push(collectedData());
      let randomIndex = Math.floor(Math.random() * receivedData.length);
      let randomElement = receivedData[randomIndex];
      randomizedData.push(randomElement);
    } else {
      console.error('No Entries Found', randomizedData)
    }
    console.log('randomWinningID', randomizedData);
    return randomizedData;
};
