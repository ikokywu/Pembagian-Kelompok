const inputName = document.querySelector(".member-input"),
  inputBtn = document.querySelector(".add-member-btn"),
  addGroupBtn = document.querySelector(".add-group-btn"),
  memberOfEachGruop = document.querySelector("#member"),
  deleteGroupBtn = document.querySelector(".clear-group");

const memberList = document.querySelector(".member-list"),
  groupList = document.querySelector(".group-set"),
  grouping = document.querySelector(".grouping");

const menuBtn = document.querySelectorAll(".title button"),
  title = document.querySelector(".about-members h2");

let data = {
  members: [],
  randomMember: [],
  groupIndex: null,
};

document.addEventListener("DOMContentLoaded", function () {
  // Mendapatkan string JSON dari localStorage berdasarkan kunci
  const localStorageData = localStorage.getItem("membersData");

  // Memeriksa apakah data ada di localStorage
  if (!localStorageData) {
    localStorage.setItem("membersData", JSON.stringify(data));
  }
});

inputBtn.addEventListener("click", () => {
  if (inputName.value === "") {
    alert("Nama tidak boleh kosong!");
    return;
  }
  const data = JSON.parse(localStorage.getItem("membersData"));
  data.members.push(inputName.value);
  localStorage.setItem("membersData", JSON.stringify(data));
  showMember();
  numberOfMembers();
});

const showMember = () => {
  let data = JSON.parse(localStorage.getItem("membersData"));
  if (data.members.length === 0) {
    memberList.style.display = "none";
    return;
  }
  memberList.innerHTML = "";
  memberList.style.display = "block";
  for (const member of data.members) {
    memberList.innerHTML += `<div class="member-container">
     <div class="member-name">
         <h3>${member}</h3>
      </div>
   
      <div class="action">
         <i class="fa-regular fa-trash-can"></i>
      </div>
   </div>`;
  }
};

showMember();

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash-can")) {
    const element = e.target.parentElement.parentElement;
    const nameMember = element.querySelector(".member-name h3").innerText;
    deleteMember(nameMember);
  }
});

const deleteMember = (name) => {
  const data = JSON.parse(localStorage.getItem("membersData"));
  data.members = data.members.filter((member) => {
    return name !== member;
  });
  data.members = data.members;
  localStorage.setItem("membersData", JSON.stringify(data));
  showMember();
  numberOfMembers();
};

menuBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    for (const menu of menuBtn) {
      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
      }
    }

    const data = JSON.parse(localStorage.getItem("membersData"));

    if (btn.classList.contains("member-list-btn")) {
      title.innerText = "Daftar Anggota";
      inputName.parentElement.style.display = "block";
      memberList.style.display = "block";
      groupList.style.display = "none";
      grouping.style.display = "none";
      deleteGroupBtn.style.display = "none";
      showMember();
    } else {
      title.innerText = "Kelompok";
      memberList.style.display = "none";
      inputName.parentElement.style.display = "none";

      if (data.randomMember.length === 0) {
        groupList.style.display = "block";
        grouping.style.display = "none";
      } else {
        showExistGroup();
        groupList.style.display = "none";
        grouping.style.display = "block";
        deleteGroupBtn.style.display = "block";
      }
    }

    btn.classList.add("active");
  });
});

let randomMember = null;
addGroupBtn.addEventListener("click", () => {
  const data = JSON.parse(localStorage.getItem("membersData"));

  if (data.members.length < 2) {
    alert("Jumblah anggota harus lebih dari 1");
    return;
  }
  const groupIndex = Math.ceil(data.members.length / memberOfEachGruop.value);
  makeGroups(groupIndex, memberOfEachGruop.value);
  document.querySelector(".group-set").style.display = "none";
});

const makeGroups = (groupIndex, memberOfEachGruop) => {
  grouping.style.display = "block";
  deleteGroupBtn.style.display = "block";

  const data = JSON.parse(localStorage.getItem("membersData"));
  randomMember = randomArray(data.members);
  data.groupIndex = groupIndex;
  data.randomMember = randomMember;
  localStorage.setItem("membersData", JSON.stringify(data));

  for (let i = 0; i < groupIndex; i++) {
    const fragments = filterMember(randomMember, memberOfEachGruop);
    grouping.innerHTML += `<div class="group-list">
      <h1>Kelompok ${i + 1}</h1>
      <p>${fragments}</p>
   </div>`;
  }
};

const showExistGroup = () => {
  const data = JSON.parse(localStorage.getItem("membersData"));
  grouping.innerHTML = "";
  randomMember = data.randomMember;
  for (let i = 0; i < data.groupIndex; i++) {
    const fragments = filterMember(randomMember, memberOfEachGruop.value);
    grouping.innerHTML += `<div class="group-list">
       <h1>Kelompok ${i + 1}</h1>
       <p>${fragments}</p>
    </div>`;
  }
};

deleteGroupBtn.addEventListener("click", () => {
  grouping.innerHTML = "";
  groupList.style.display = "block";
  deleteGroupBtn.style.display = "none";

  const data = JSON.parse(localStorage.getItem("membersData"));
  data.randomMember = [];
  localStorage.setItem("membersData", JSON.stringify(data));
  alert("Grup berhasil dihapus!");
});

const numberOfMembers = () => {
  const data = JSON.parse(localStorage.getItem("membersData"));
  document.querySelector(".num-of-members .num").innerText =
    data.members.length;
  document.querySelector(".about-members p").innerText =
    data.members.length + " Anggota";

  if (data.members.length < 2) return;
  memberOfEachGruop.innerHTML = "";
  for (let i = 2; i <= data.members.length; i++) {
    memberOfEachGruop.innerHTML += `<option value="${i}">${i}</option>`;
  }
};

numberOfMembers();

function randomArray(listMember) {
  let randomList = listMember.slice(0);

  function random() {
    return 0.5 - Math.random();
  }

  return randomList.sort(random);
}

const filterMember = (members, groupIndex) => {
  let memberFragments = [];
  for (let i = 0; i < groupIndex; i++) {
    if (!members[i]) return memberFragments;
    memberFragments.push(members[i]);

    randomMember = randomMember.filter((e) => {
      return e !== members[i];
    });
  }
  return memberFragments;
};
