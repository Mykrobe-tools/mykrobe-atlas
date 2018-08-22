/* @flow */

import _ from 'lodash';

import type { Choice } from '../types';

export const titleForChoice = (choice: Choice, delimeter: string = ' › ') => {
  return choice.titles
    ? choice.titles.join(delimeter)
    : choice.title || 'Untitled';
};

// build an inverse tree of titles

export const choiceTitleTree = _.memoize(
  choices => {
    let titleTree = {};
    const choicesKeys = Object.keys(choices);
    choicesKeys.forEach(key => {
      const choice = choices[key];
      let node = titleTree;
      if (choice.titles) {
        const reverseTitles = [...choice.titles].reverse();
        reverseTitles.forEach(title => {
          if (!node[title]) {
            node[title] = {};
          }
          node = node[title];
        });
      }
    });
    return titleTree;
  },
  choices => JSON.stringify(choices)
);

export const shortesTitleForChoiceWithKeyInChoices = (
  choiceKey: string,
  choices: { [string]: Choice },
  delimeter: string = ' › '
) => {
  const titleTree = choiceTitleTree(choices);
  // traverse and stop when we are the only entry
  const choice = choices[choiceKey];
  const reverseTitles = [...choice.titles].reverse();
  let titles = [];
  let node = titleTree;
  let i = 0;
  while (i < reverseTitles.length) {
    const title = reverseTitles[i];
    titles.push(title);
    node = node[title];
    if (!node) {
      break;
    }
    if (Object.keys(node).length === 1) {
      break;
    }
    i++;
  }
  titles.reverse();
  return titles.join(delimeter);
};
