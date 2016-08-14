import MykrobeConfig from './MykrobeConfig';

class MykrobeJsonTransformer {
  constructor(config = new MykrobeConfig()) {
    this.config = config;
  }

  transform(jsonString) {
    return new Promise((resolve, reject) => {
      this.stringToJson(jsonString).then((json) => {
        resolve(json);
      });
    });
  }

  stringToJson(string) {
    return new Promise((resolve, reject) => {
      // extract just the portion in curly braces {}
      const first = string.indexOf('{');
      const last = string.lastIndexOf('}');
      var extracted = string.substr(first, 1 + last - first);
      debugger
      // replace escaped tabs, quotes, newlines
      extracted = extracted.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
      console.log(extracted);
      const json = JSON.parse(extracted);
      resolve(json);
    });
  }
}
export default MykrobeJsonTransformer;
