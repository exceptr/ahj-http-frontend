import getAllTickets from "./helpDeskAPI";

const ticketList = document.querySelector(".tickets-list");

function createTicketHtml(id, name, status, created) {
  const ticket = document.createElement("li");
  ticket.classList.add("ticket");
  ticket.dataset.id = id;

  if (!status) {
    ticket.innerHTML = `
        <span class="ticket-completed" data-id="completed"></span>
        <span class="ticket-text">
          <p class="ticket-text-name">${name}</p>
        </span>
        <span class="ticket-date">${created}</span>
        <span class="ticket-edit" data-id="edit"></span>
        <span class="ticket-remove" data-id="remove"></span>
        `;
    return ticket;
  }
  ticket.innerHTML = `
    <span class="ticket-completed completed" data-id="completed"></span>
    <span class="ticket-text">
      <p class="ticket-text-name">${name}</p>
    </span>
    <span class="ticket-date">${created}</span>
    <span class="ticket-edit" data-id="edit"></span>
    <span class="ticket-remove" data-id="remove"></span>
    `;
  return ticket;
}

function dateToConvert(dateValue) {
  const dateTimezone = new Date(dateValue);
  const date = dateTimezone.toLocaleDateString();
  const time = dateTimezone.toLocaleTimeString();

  return `${date} ${time}`;
}

export function ticketCreate(ticket) {
  const { id, name, status, created } = ticket;

  const createdTime = dateToConvert(created);
  const ticketHtml = createTicketHtml(id, name, status, createdTime);

  ticketList.appendChild(ticketHtml);
}

export default async function renderTicket() {
  const tickets = await getAllTickets();

  for (let ticket of tickets) {
    ticketCreate(ticket);
  }
}

export function descriptionHTML(ticket, descriptionResponse) {
  const ticketText = ticket.querySelector(".ticket-text");
  const description = document.createElement("p");
  description.classList.add("ticket-text-desciption");
  description.textContent = descriptionResponse;
  ticketText.appendChild(description);
  return;
}

export function containerDisplay(container, display) {
  if (display === "block") {
    container.style.display = "block";
    return;
  }

  if (display === "none") {
    container.style.display = "none";
    return;
  }
}
