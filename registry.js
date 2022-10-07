import chalk from "chalk";
import inquirer from "inquirer";
import Gift from "./gift.js";
import Child from "./child.js";
import { goBackToInitialStep } from "./index.js";

const initRegistry = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What do you want to see?",
        choices: [
          "Assigned Pairs",
          "All Children and Gifts",
          "Number of unassigned children",
          "Number of unassigned gifts",
          "Go back",
        ],
      }]).then((answers) => {
        switch (answers.action) {
          case "Assigned Pairs":
            showAssignedPairs();
            break;
          case "All Children and Gifts":
            showAllChildrenAndGifts();
            break;
          case "Number of unassigned children":
            showUnassignedChildren();
            break;
          case "Number of unassigned gifts":
            showUnassignedGifts();
            break;
          case "Go back":
            goBackToInitialStep();
            break;
        }
        goBack();
      });
};

const showAssignedPairs = () => {
  const assignedPairs = Child.all.filter((child) => child.assignedGift).map((child) => {
    return {
      child: child.name,
      gift: child.assignedGift.name
    };
  }
  );

  console.log(assignedPairs);

  if (assignedPairs.length === 0) {
    console.log("There are no assigned pairs");
    return;
  }

  console.log(`total assigned pairs: ${chalk.bgGreen.bold(assignedPairs.length)}`);
  console.table(assignedPairs);
};

const showAllChildrenAndGifts = () => {
  const allChildren = Child.all.map((child) => child.name);
  const allGifts = Gift.all.map((gift) => gift.name);

  console.log(`total children: ${chalk.bgGreen.bold(allChildren.length)}`);
  console.table(allChildren);
  console.log(`total gifts: ${chalk.bgGreen.bold(allGifts.length)}`);
  console.table(allGifts);

};

const showUnassignedChildren = () => {
  const unassignedChildren = Child.all.filter((child) => !child.assignedGift).map((child) => child.name);

  if (unassignedChildren.length === 0) {
    console.log("All children have been assigned a gift!");
    return;
  }

  console.log(`total unassigned children: ${chalk.bgGreen.bold(unassignedChildren.length)}`);
  console.table(unassignedChildren);
};

const showUnassignedGifts = () => {
  const unassignedGifts = Gift.all.filter((gift) => !gift.assignedTo).map((gift) => gift.name);

  if (unassignedGifts.length === 0) {
    console.log("All gifts have been assigned a child!");
    return;
  }

  console.log(`total unassigned gifts: ${chalk.bgGreen.bold(unassignedGifts.length)}`);
  console.table(unassignedGifts);
};

const goBack = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What do you want to do next?",
        choices: [
          "Go back to registry",
          "Go back to initial step",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "Go back to registry":
          initRegistry();
          break;
        case "Go back to initial step":
          goBackToInitialStep();
          break;
      }
    });
};


export { initRegistry };