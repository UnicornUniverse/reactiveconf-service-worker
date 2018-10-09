export default async function callApi (url){
  const response = await fetch(url);
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
};