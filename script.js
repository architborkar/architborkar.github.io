const projectsFolder = ["PiBook", "MDF CNC"];

// ---------- HOME ----------
async function loadHome() {
  showView("home");

  const list = document.getElementById("project-list");
  list.innerHTML = "";

  for (const project of projectsFolder) {
    const meta = await fetch(`projects/${project}/metadata.json`).then(r => r.json());

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="projects/${project}/${meta.thumbnail}">
      <h3>${meta.name}</h3>
      <p>${meta.description}</p>
    `;

    card.onclick = () => loadProject(project);
    list.appendChild(card);
  }
}

// ---------- PROJECT ----------
async function loadProject(project) {
  showView("project");

  const meta = await fetch(`projects/${project}/metadata.json`).then(r => r.json());
  document.getElementById("project-title").textContent = meta.name;
  document.getElementById("project-desc").textContent = meta.description;

  const list = document.getElementById("version-list");
  list.innerHTML = "";

  meta.versions.forEach(v => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="projects/${project}/${v.id}/${v.files.images[0]}">
      <h4>${v.title}</h4>
      <p>${v.description}</p>
    `;
    card.onclick = () => loadVersion(project, v.id);
    list.appendChild(card);
  });

  document.getElementById("back-to-home").onclick = loadHome;
}

// ---------- VERSION ----------
async function loadVersion(project, versionId) {
  showView("version");

  const meta = await fetch(`projects/${project}/metadata.json`).then(r => r.json());
  const version = meta.versions.find(v => v.id === versionId);

  document.getElementById("version-title").textContent =
    `${meta.name} – ${version.title}`;
  document.getElementById("version-desc").textContent =
    version.description;

  const content = document.getElementById("version-content");
  content.innerHTML = "";

  // Images
  version.files.images.forEach(img => {
    const i = document.createElement("img");
    i.src = `projects/${project}/${versionId}/${img}`;
    content.appendChild(i);
  });

  // Videos
  version.files.videos.forEach(video => {
    const v = document.createElement("video");
    v.src = `projects/${project}/${versionId}/${video}`;
    v.controls = true;
    content.appendChild(v);
  });

  // README
  if (version.files.docs) {
    const doc = document.createElement("div");
    doc.className = "readme";
    doc.innerHTML = "<p>Loading documentation…</p>";
    content.appendChild(doc);

    fetch(`projects/${project}/${versionId}/${version.files.docs}`)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(md => {
        doc.innerHTML = marked.parse(md);
      })
      .catch(() => {
        doc.innerHTML = "<p>No documentation available.</p>";
      });
  }

  document.getElementById("back-to-project").onclick =
    () => loadProject(project);
}

// ---------- VIEW SWITCH ----------
function showView(view) {
  document.getElementById("home-view").style.display =
    view === "home" ? "block" : "none";
  document.getElementById("project-view").style.display =
    view === "project" ? "block" : "none";
  document.getElementById("version-view").style.display =
    view === "version" ? "block" : "none";
}

// ---------- START ----------
loadHome();
