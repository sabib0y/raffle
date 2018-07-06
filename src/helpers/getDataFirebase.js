import fire from '../fire';

export default function getPosts(item) {
  let collectedData = [];
  let randomizedData = [];
  fire.database().ref(item).once('value').then((snapshot) => {
    let receivedDataTest = snapshot.val();
    let receivedData = Object.entries(snapshot.val());
    receivedData.map(item => {
      collectedData.push(item[1].user)
    });
    return randomizedData;
  });
}
