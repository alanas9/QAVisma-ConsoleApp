#!/usr/bin/env node

// import all packages installed in node moudles
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import chalkAnimation from "chalk-animation";
import PressToContinuePrompt from 'inquirer-press-to-continue';

import fs from "fs";

import Gift from "./gift.js";
import Child from "./child.js";
import { initRegistry } from "./registry.js";

inquirer.registerPrompt("press-to-continue", PressToContinuePrompt);

const parseGifts = () => {
  const gifts = fs.readFileSync("gifts.txt").toString().split("\n");

  gifts.forEach((gift) => new Gift(gift));
};

const parseChildren = () => {
  const children = fs.readFileSync("children.txt").toString().split("\n");

  children.forEach((child) => new Child(child));
};

parseGifts();
parseChildren();

const initialStep = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: [
          "Go to registry",
          "Add a gift",
          "Add a child",
          "Show gifts",
          "Show children",
          "Assign gift",
          "Randomly Assign a gift to child",
          "Assign all gifts at once",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "Go to registry":
          initRegistry();
          break;
        case "Add a gift":
          addGift();
          break;
        case "Add a child":
          addChild();
          break;
        case "Show gifts":
          showGifts();
          break;
        case "Show children":
          showChildren();
          break;
        case "Assign gift":
          assignGift();
          break;
        case "Randomly Assign a gift to child":
          randomAssignGift();
          break;
        case "Assign all gifts at once":
          assignAllGifts();
          break;
        case "Exit":
          exit();
          break;
        default:
          break;
      }
    });
};

initialStep();

export const goBackToInitialStep = () => {
  inquirer
    .prompt([
      {
        type: "press-to-continue",
        name: "continue",
        message: "Press any key to continue",
        anyKey: true,
      },
    ])
    .then(() => {
      console.log("");
        initialStep();
    });
};

const addChild = () => {
  // use inquirer to get input for child name
  inquirer
    .prompt([
      {
        type: "input",
        name: "childName",
        message: "What is the child's name?",
      },
    ])
    .then((answer) => {

      // validate if child name is already existing. Take into account that child name is nit case sensitive and name first letter capital
      const childName = answer.childName.toLowerCase().replace(/^\w/, (c) =>
        c.toUpperCase()
      );
      const child = Child.all.find((child) => child.name === childName);

      if (child) {
        console.log(
          chalk.red(
            `Child with name ${chalk.bold(childName)} already exists. Please try again.`
          )
        );
        addChild();
      } else {
        new Child(childName);
        console.log(
          chalk.green(
            `Child with name ${chalk.bold(childName)} has been added.`
          )
        );
        goBackToInitialStep();
      }
    });

  // validate if child name is already existing. Take into account that child name is not case sensitive
  /*   if (Child.all.includes(answer.childName)) {
       console.log(`Child with name ${answer.childName} already exists`);
       return;
     }
// first capital letter of child name
     const childName = answer.childName
       .split(" ")
       .map((word) => word[0].toUpperCase() + word.slice(1))
       .join(" ");
     new Child(answer.childName);
     // add console.log
     console.log(`Child ${answer.childName} added`);
   })
   .finally(() => {
     console.log(Child.all);
     initialStep();
   });
   */
};

const addGift = () => {
  // use inquirer to get input for gift name
  inquirer
    .prompt([
      {
        type: "input",
        name: "giftName",
        message: "What is the gift name?",
      },
    ])
    .then((answer) => {
      // gifts.push(answer.giftName);
      new Gift(answer.giftName);
      console.log(`Gift ${answer.giftName} added`);
    })
    .finally(() => {
      initialStep();
      // new Gift(gift)
    });
};

const showGifts = () => {
  console.log(Gift.all);
  goBackToInitialStep();
};

const assignGift = () => {
  // select gift and select child
  inquirer
    .prompt([
      {
        type: "list",
        name: "gift",
        message: "Select a gift",
        choices: Gift.all.map((gift) => {
          if (gift.assignedTo) {
            return;
          }

          return gift.name;
        }),
      },
      {
        type: "list",
        name: "child",
        message: "Select a child",
        choices: Child.all.map((child) => {
          if (child.assignedGift) {
            return;
          }

          return child.name;
        }),
      },
    ])
    .then((answers) => {
      // assign child to gift
      const gift = Gift.all.find((gift) => gift.name === answers.gift);
      const child = Child.all.find((child) => child.name === answers.child);

      assignGiftToChildren(gift, child);
    })
    .finally(() => {
      goBackToInitialStep();
    });
};

const showChildren = () => {
  console.log(Child);
  goBackToInitialStep();
};

// randomly assign a gift to a childs
const randomAssignGift = () => {
  // get a random gift
  const randomGift = Gift.all[Math.floor(Math.random() * Gift.all.length)];
  // get a random child
  const randomChild = Child.all[Math.floor(Math.random() * Child.all.length)];
  // assign gift to child
  assignGiftToChildren(randomGift, randomChild);

  goBackToInitialStep();
};

const exit = () => {
  chalkAnimation.karaoke("I hope I helped Santa! :)");

  setTimeout(() => {
    process.exit();
  }, 2500);

  // setTimeout(() => {
  //   .karaoke.start(); // Animation resumes
  // }, 2000);
};

const assignAllGifts = () => {
  // get all gifts
  const gifts = Gift.all;
  // get all children
  const children = Child.all;
  // assign gifts to children
  for (let i = 0; i < gifts.length; i++) {
    const gift = gifts[i];
    const child = children[i];
    assignGiftToChildren(gift, child);
  }

  goBackToInitialStep();
};

const assignGiftToChildren = (gift, child) => {
  gift.assignTo(child);
  child.assignGift(gift);
  console.log(`Gift ${chalk.green(gift.name)} assigned to ${chalk.green.bold(child.name)}`);
};