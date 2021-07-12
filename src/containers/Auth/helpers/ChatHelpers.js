import myAxios from "../../../utils/connection";

// removes any < and > symbol from emails
export const stripContact = (string) => {
  let email = string.substring(
    string.lastIndexOf("<") + 1,
    string.lastIndexOf(">")
  );

  if (email) {
    let name = string.substr(0, string.indexOf("<"));
    name = name.replace(/['"]+/g, "");
    return { email, name };
  }
  return string;
};

// Strips emails to necessary datas only and sorts them
export const sortEmail = (
  userEmail,
  emails,
  isDuplicate = true,
  sort = "desc"
) => {
  let prevSender = [];
  console.log(emails);
  const reduce = emails.reduce(function (filtered, option) {
    // return filtered.includes(option) ? filtered : [...filtered, option];
    const { id, snippet, payload } = option;
    const senderString = payload.headers.find((data) => {
      return data.name === "From" || data.name === "from";
    });

    const receiverString = payload.headers.find((data) => {
      return data.name === "To" || data.name === "to";
    });

    const strippedFrom = stripContact(senderString.value);
    const strippedTo = stripContact(receiverString.value);

    const sender = {
      name: strippedFrom.name ? strippedFrom.name : strippedFrom,
      email: strippedFrom.email ? strippedFrom.email : strippedFrom,
    };

    const receiver = {
      name: strippedTo.name ? strippedTo.name : strippedTo,
      email: strippedTo.email ? strippedTo.email : strippedTo,
    };

    let contact = {
      name: sender.name,
      email: sender.email,
    };

    if (sender.email === userEmail) {
      contact.email = receiver.email;
      contact.name = receiver.name;
    }

    const subject = payload.headers.find((data) => {
      return data.name === "Subject" || data.name === "subject";
    });

    const date = payload.headers.find((data) => {
      return data.name === "Date" || data.name === "date";
    });

    const time = new Date(date.value);

    let content = snippet;

    if (!isDuplicate) {
      if (
        payload.mimeType === "text/plain" ||
        payload.mimeType === "text/html"
      ) {
        const buff = new Buffer(payload.body.data, "base64");
        content = buff.toString("ascii");
        // console.log(option);
        if (payload.mimeType === "text/html") {
          console.log(content);
        }
      } else {
        if (payload.parts.length > 0 && payload.parts[0].body.data) {
          const index = payload.parts.length === 1 ? 0 : 1;
          const buff = new Buffer(payload.parts[index].body.data, "base64");
          content = buff.toString("ascii");
        }
      }
    }

    if (
      prevSender.length > 0 &&
      prevSender.includes(contact.email) &&
      isDuplicate
    ) {
      return filtered;
    }
    prevSender.push(contact.email);

    filtered.push({
      id,
      contact,
      sender,
      receiver,
      subject,
      snippet,
      time,
      content,
    });

    return filtered;
  }, []);

  let sortedEmail = reduce.slice().sort((a, b) => b.time - a.time);

  if (sort === "asc") {
    sortedEmail = reduce.slice().sort((a, b) => a.time - b.time);
  }

  return sortedEmail;
};

// Adds new emails and sorts them to the state
export const addReceivedEmails = (emails) => {
  const newEmails = emails.slice().sort((a, b) => b.time - a.time);
  console.log("joined emails", emails);

  return newEmails.reduce((filtered, email) => {
    // console.log(email);
    const existing = filtered
      ? filtered.find((data) => data.contact.email === email.contact.email)
      : null;
    if (existing) {
      return filtered;
    }
    filtered.push(email);
    return filtered;
  }, []);
};

// Fetch Emails from node js server with google api
export async function getEmails() {
  console.log("getting");
  const res = await myAxios.get("/getEmails");
  const data = await res.data;
  return data;
}

// Fetch Emails from a specific email address
export async function getMessages(email, userEmail) {
  const res = await myAxios.get(`/getMessages/${email}`);
  const data = await res.data;
  const sortedMessages = sortEmail(userEmail, data, false, "asc");
  return sortedMessages;
}

// Sends email to the given recipient (to)
export async function sendMessage(to, subject, message) {
  const res = await myAxios.post("/email", {
    to: to,
    subject: subject,
    message: message,
  });
  const data = await res.data;
  // alert(data.message);
  return data;
}

// Adds note to the database
export async function addNote(title, text, userID) {
  const res = await myAxios.post("/addNote", {
    title: title,
    text: text,
    userID: userID,
  });
  const data = await res.data;
  return data;
}

// Fetch notes from the database
export async function getNotes(userID) {
  const res = await myAxios.get(`/getNotes/${userID}`);
  const data = await res.data;
  return data;
}

// Update notes to the database
export async function updateNote(title, text, noteID) {
  const res = await myAxios.post("/updateNote", {
    title: title,
    text: text,
    id: noteID,
  });
  const data = await res.data;
  return data;
}

// Deletes notes from the database
export async function deleteNote(noteID) {
  const res = await myAxios.delete(`/deleteNote/${noteID}`);
  const data = await res.data;
  return data;
}

// Fetch notes from the database
export async function getTasks(userID) {
  const res = await myAxios.get(`/getTodos/${userID}`);
  const data = await res.data;
  return data;
}

export async function addTask(title, status, todo, userID) {
  const res = await myAxios.post("/addTodo", {
    title,
    status,
    todo,
    userID,
  });
  const data = await res.data;

  return data;
}

// Update notes to the database
export async function updateTask(title, status, todo, taskID) {
  const res = await myAxios.post("/updateTodo", {
    title,
    status,
    todo,
    id: taskID,
  });
  const data = await res.data;
  return data;
}

// Deletes notes from the database
export async function deleteTask(taskID) {
  const res = await myAxios.delete(`/deleteTodo/${taskID}`);
  const data = await res.data;
  return data;
}

export const letterColors = (letter) => {
  const alphabets = [
    { letter: "A", color: "#B54168" },
    { letter: "B", color: "#DF5A0A" },
    { letter: "C", color: "#544ADF" },
    { letter: "D", color: "#7056AD" },
    { letter: "E", color: "#ED5D10" },
    { letter: "F", color: "#902E4A" },
    { letter: "G", color: "#2F71B5" },
    { letter: "H", color: "#25739C" },
    { letter: "I", color: "#5D1E83" },
    { letter: "J", color: "#272A84" },
    { letter: "K", color: "#A335BA" },
    { letter: "L", color: "#488405" },
    { letter: "M", color: "#60973E" },
    { letter: "N", color: "#073666" },
    { letter: "O", color: "#35695A" },
    { letter: "P", color: "#907A58" },
    { letter: "Q", color: "#EB598E" },
    { letter: "R", color: "#E83070" },
    { letter: "S", color: "#3E2C05" },
    { letter: "T", color: "#E872F3" },
    { letter: "U", color: "#6A7213" },
    { letter: "V", color: "#4A408F" },
    { letter: "W", color: "#3CBD95" },
    { letter: "X", color: "#8BA04A" },
    { letter: "Y", color: "#DDAF51" },
    { letter: "Z", color: "#F18E83" },
  ];
  const found = alphabets.find((data) => data.letter === letter);
  console.log(found);
  return found;
};
