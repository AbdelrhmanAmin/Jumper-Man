const scoreSystem = (() => {
  const key = 'C4WZklBgOz9HR7DdiA4L';
  const url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${key}/scores/`;
  const info = {};
  const postScores = () => {
    const data = info;
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    })
      .catch((err) => {
        throw new Error(`Could not reach the API: ${err}`);
      });
  };
  const namer = (name) => {
    info.user = name;
  };

  const scorer = (num) => {
    info.score = num;
  };
  return {
    postScores,
    namer,
    scorer,
  };
});
export default scoreSystem();