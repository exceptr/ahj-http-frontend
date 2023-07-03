import { ticketCreate, descriptionHTML, containerDisplay } from "./helpDeskDOM";
import {
  removeTicket,
  createTicket,
  ticketComplete,
  ticketEdit,
  ticketById,
} from "./helpDeskAPI";

// Добавить тикет
const btnAddTicket = document.querySelector(".btn-add-ticket");
const addTicketContainer = document.querySelector(".add-ticket-container");

function btnAddTicketEventListener() {
  containerDisplay(addTicketContainer, "block");
}

btnAddTicket.addEventListener("click", btnAddTicketEventListener);

const addTicketContainerBtn = document.querySelector(
  ".add-ticket-container-btn"
);

async function addTicketContainerBtnEventListener(e) {
  e.preventDefault();
  const target = e.target;

  if (target.classList.contains("btn-cancel-add-ticket-container")) {
    containerDisplay(addTicketContainer, "none");
    return;
  }
  const shortDescription = target.parentElement.parentElement.querySelector(
    ".ticket-short-description-textarea"
  );
  const detailedDescription = target.parentElement.parentElement.querySelector(
    ".ticket-detailed-description-textarea"
  );
  const name = shortDescription.value;
  const description = detailedDescription.value;

  if (name.length >= 3 && description.length >= 6) {
    console.log(description);
    const response = await createTicket({ name, description, status: false });
    if (response) {
      ticketCreate(response);
      containerDisplay(addTicketContainer, "none");
      shortDescription.value = ``;
      detailedDescription.value = ``;
      return;
    }
  }
}

addTicketContainerBtn.addEventListener(
  "click",
  addTicketContainerBtnEventListener
);

// Удалить, выполнить, редактировать тикет
const helpdeskContainer = document.querySelector(".helpdesk-container");
const deleteTicketContainer = document.querySelector(
  ".delete-ticket-container"
);
const editTicketContainer = document.querySelector(".edit-ticket-container");
const shortDescription = editTicketContainer.querySelector(
  ".ticket-short-description-textarea"
);
const detailedDescription = editTicketContainer.querySelector(
  ".ticket-detailed-description-textarea"
);
let ticketID;

async function helpdeskContainerEventListener(e) {
  e.preventDefault();
  const target = e.target;

  if (target.classList.contains("ticket-remove")) {
    ticketID = target.parentElement.dataset.id;
    containerDisplay(deleteTicketContainer, "block");
    return;
  }

  if (target.classList.contains("ticket-completed")) {
    ticketID = target.parentElement.dataset.id;

    const response = await ticketComplete(ticketID);

    if (response) {
      target.classList.toggle("completed");
      return;
    }
    if (!response) {
      target.classList.toggle("completed");
      return;
    }
  }

  if (target.classList.contains("ticket-edit")) {
    ticketID = target.parentElement.dataset.id;

    containerDisplay(editTicketContainer, "block");

    const description = await ticketById(ticketID);
    if (description) {
      const ticket = document.querySelector(`[data-id="${ticketID}"]`);

      const ticketName = ticket.querySelector(".ticket-text-name").textContent;
      shortDescription.value = ticketName;
      detailedDescription.value = description;
      return;
    }

    if (!description) {
      const ticket = document.querySelector(`[data-id="${ticketID}"]`);

      const ticketName = ticket.querySelector(".ticket-text-name").textContent;
      shortDescription.value = ticketName;
      return;
    }
  }
}

async function deleteTicketContainerEventListener(e) {
  e.preventDefault();
  const target = e.target;

  if (target.classList.contains("btn-ok-add-ticket-container")) {
    const ticket = document.querySelector(`[data-id="${ticketID}"]`);

    const response = await removeTicket(ticketID);

    const { created } = response;
    if (created) {
      containerDisplay(deleteTicketContainer, "none");
      ticket.remove();
      return;
    }
  }

  if (target.classList.contains("btn-cancel-add-ticket-container")) {
    containerDisplay(deleteTicketContainer, "none");
    return;
  }
}

async function editTicketContainerEventListener(e) {
  e.preventDefault();
  const target = e.target;

  if (target.classList.contains("btn-cancel-add-ticket-container")) {
    containerDisplay(editTicketContainer, "none");
    return;
  }
  const shortDescription = target.parentElement.parentElement.querySelector(
    ".ticket-short-description-textarea"
  );
  const detailedDescription = target.parentElement.parentElement.querySelector(
    ".ticket-detailed-description-textarea"
  );
  const name = shortDescription.value;
  const description = detailedDescription.value;

  if (name.length >= 3 && description.length >= 6) {
    const response = await ticketEdit(ticketID, { name, description });
    if (response) {
      const ticket = document.querySelector(`[data-id="${ticketID}"]`);

      ticket.querySelector(".ticket-text-name").textContent =
        shortDescription.value;

      containerDisplay(editTicketContainer, "none");
      shortDescription.value = ``;
      detailedDescription.value = ``;
      return;
    }
  }
}

editTicketContainer.addEventListener("click", editTicketContainerEventListener);
helpdeskContainer.addEventListener("click", helpdeskContainerEventListener);
deleteTicketContainer.addEventListener(
  "click",
  deleteTicketContainerEventListener
);

// Подгрузка описания тикета
const ticketsList = document.querySelector(".tickets-list");

async function getTicketDescriptionEventListener(e) {
  e.preventDefault();
  const target = e.target;

  if (target.parentElement.dataset.id) {
    ticketID = target.parentElement.dataset.id;
  }
  if (target.dataset.id) {
    ticketID = target.dataset.id;
  }
  if (target.parentElement.parentElement.dataset.id) {
    ticketID = target.parentElement.parentElement.dataset.id;
  }

  if (
    target.classList.contains("ticket-completed") ||
    target.classList.contains("ticket-edit") ||
    target.classList.contains("ticket-remove")
  ) {
    return;
  }

  const descriptionResponse = await ticketById(ticketID);
  const ticket = document.querySelector(`[data-id="${ticketID}"]`);

  if (
    descriptionResponse &&
    ticket.querySelector(".ticket-text-desciption") === null
  ) {
    descriptionHTML(ticket, descriptionResponse);
    return;
  }
}

ticketsList.addEventListener("click", getTicketDescriptionEventListener);
