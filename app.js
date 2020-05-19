const botones = document.querySelector("#botones");
const nombreUser = document.querySelector("#nombreUser");
const protegido = document.querySelector("#protegido");
const form = document.getElementById("form");
const message = document.getElementById("message");
//escuchar los cambios
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    contenidoChat(user);
    sendMessage(user);
    getMessage(user);
    cerrarsession();
  } else {
    inicioPrincipalSinContenido();
    iniciarSession();
  }
});

//contenido chat
const contenidoChat = (user) => {
  botones.innerHTML = `<button class="btn btn-danger" id="btnSalir">salir</button>`;
  nombreUser.innerHTML = `${user.displayName}`;
  protegido.innerHTML = ` <p class="text-center lead mt-5">Bienvenido ${user.email}</p>`;
  form.classList = "input-group p-4 bg-dark fixed-bottom container";
  getMessage(user);
};

const inicioPrincipalSinContenido = () => {
  botones.innerHTML = `<button class="btn btn-primary mx-2"id="btnAcceder">acceder</button>`;
  nombreUser.innerHTML = `chat con javascript y firebase`;
  protegido.innerHTML = ` <p class="text-center lead mt-5">Debes Iniciar Seccion</p>`;
  form.classList = "input-group p-4 bg-dark fixed-bottom container d-none";
  
};

//inciar secion
const iniciarSession = () => {
  const btnAcceder = document.querySelector("#btnAcceder");
  btnAcceder.addEventListener("click", async (e) => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  });
};
//cerrar secion
const cerrarsession = () => {
  const btnSalir = document.querySelector("#btnSalir");
  btnSalir.addEventListener("click", (e) => {
    try {
      firebase.auth().signOut();
    } catch (error) {
      console.log(error);
    }
  });
};

const sendMessage = (user) => {
  form.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      if (!message.value.trim()) {
        return alert("please typing field");
      }
      const messageValue = message.value;
      const db = firebase.firestore();
      await db.collection("chat").add({
        text: messageValue,
        uid: user.uid,
        date: Date.now(),
      });
      form.reset();
    } catch (error) {
      console.log(error);
    }
  });
};

const getMessage = (user) => {

    const db = firebase.firestore();
    db.collection("chat").orderBy('date').onSnapshot(query=>{
    protegido.innerHTML=""
    query.forEach((element) => {
      console.log(element.data());
     
      if(element.data().uid == user.uid){
        protegido.innerHTML += `
        <div class="d-flex justify-content-end mt-5">
          <span class="badge  badge-pill badge-primary p-2 ">${element.data().text}</span>
        </div>

        `
      }else {
        protegido.innerHTML += `
        <div class="d-flex justify-content-start mt-5">
        <span class="badge  badge-pill badge-secondary p-2 ">${element.data().text}</span>
      </div>

        `
      }
      protegido.scrollTop = protegido.scrollHeight
    });
    })
}


