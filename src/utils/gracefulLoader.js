export default async function(time, promise) {
  const promiseTimeout = new Promise(resolve => setTimeout(resolve, time));
  const promiseCombined = Promise.all([promise, promiseTimeout]);
  const values = await promiseCombined;

  return values[0];
}
