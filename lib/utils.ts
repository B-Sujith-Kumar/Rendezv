export function formatDateToIST(isoDate: string): string {
  const date = new Date(isoDate);

  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);

  const day = istDate.getUTCDate();
  const month = istDate.toLocaleString("en-US", { month: "long" });
  const year = istDate.getUTCFullYear();
  let hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes().toString().padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day} ${month} ${year}, ${hours}:${minutes} ${period}`;
}

export function calculateTimeDifference(isoDate: string): number {
  const currentDate = new Date();

  const givenDate = new Date(isoDate);
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istGivenDate = new Date(givenDate.getTime() + istOffset);

  const differenceInMilliseconds =
    istGivenDate.getTime() - currentDate.getTime();

  const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  return days;
}

export function getDateString(dateString: string): string {
  const date = new Date(dateString);
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName = dayNames[date.getUTCDay()];
  const day = date.getUTCDate();
  const monthName = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  const formattedDate = `${dayName}, ${
    day < 10 ? "0" : ""
  }${day} ${monthName}, ${year}`;

  return formattedDate;
}

export function getTime(utcDateStr: string): string {
    const utcDate = new Date(utcDateStr);

    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + istOffset);
    
    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

  return formattedTime;
}
