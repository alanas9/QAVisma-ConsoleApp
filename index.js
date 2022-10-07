#!/usr/bin/env node

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

  inquirer
    .prompt([
      {
        type: "input",
        name: "childName",
        message: "What is the child's name?",
      },
    ])
    .then((answer) => {

      
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
};

const addGift = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "giftName",
        message: "What is the gift name?",
      },
    ])
    .then((answer) => {
      new Gift(answer.giftName);
      console.log(`Gift ${answer.giftName} added`);
    })
    .finally(() => {
      initialStep();
    });
};

const showGifts = () => {
  console.log(Gift.all);
  goBackToInitialStep();
};

const assignGift = () => {
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

const randomAssignGift = () => {
  const randomGift = Gift.all[Math.floor(Math.random() * Gift.all.length)];
  const randomChild = Child.all[Math.floor(Math.random() * Child.all.length)];
  assignGiftToChildren(randomGift, randomChild);

  goBackToInitialStep();
};

const exit = () => {
  chalkAnimation.karaoke("I hope I helped Santa! :)");

  setTimeout(() => {
    process.exit();
  }, 2500);

};

const assignAllGifts = () => {
  const gifts = Gift.all;
  const children = Child.all;
  
  const availableGifts = gifts.filter((gift) => !gift.assignedTo);
  const availableChildren = children.filter((child) => !child.assignedGift);

  if (availableGifts.length < availableChildren.length) {
    console.log(
      chalk.red(
        `There are ${chalk.bold(
          children.length - gifts.length
        )} more children than gifts. Please add more gifts.`
      )
    );
    goBackToInitialStep();
    return;
  }

  for (let i = 0; i < availableGifts.length; i++) {
    const gift = availableGifts[i];
    const child = availableChildren[i];
    assignGiftToChildren(gift, child);
  }

  goBackToInitialStep();
};

const assignGiftToChildren = (gift, child) => {
  gift.assignTo(child);
  child.assignGift(gift);
  console.log(`Gift ${chalk.green(gift.name)} assigned to ${chalk.green.bold(child.name)}`);
};