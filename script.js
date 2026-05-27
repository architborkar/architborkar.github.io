// script.js

let projectsFolder = [];
let allProjectsMeta = [];
let currentFilter = "ALL";

// ---------- ELEMENTS ----------
const homeView = document.getElementById("home-view");
const projectView = document.getElementById("project-view");
const versionView = document.getElementById("version-view");

const projectList = document.getElementById("project-list");
const versionList = document.getElementById("version-list");
const versionContent = document.getElementById("version-content");

const projectTitle = document.getElementById("project-title");
const projectDesc = document.getElementById("project-desc");

const versionTitle = document.getElementById("version-title");
const versionDesc = document.getElementById("version-desc");

const filterBar = document.getElementById("filter-bar");

document
  .getElementById("back-to-home")
  .addEventListener("click", loadHome);

// ---------- VIEW SWITCH ----------
function showView(view) {

  const views = {
    home: homeView,
    project: projectView,
    version: versionView
  };

  Object.values(views).forEach(v => {
    v.classList.add("hidden");
  });

  views[view].classList.remove("hidden");
}

// ---------- FETCH JSON ----------
async function fetchJSON(path) {

  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json();
}

// ---------- HOME ----------
async function loadHome() {

  showView("home");

  projectList.innerHTML =
    "<p class='loading-text'>Loading projects...</p>";

  try {

    // LOAD PROJECT INDEX
    projectsFolder = await fetchJSON(
      "projects/projects.json"
    );

    allProjectsMeta = [];

    // LOAD ALL METADATA
    for (const project of projectsFolder) {

      const meta = await fetchJSON(
        `projects/${project}/metadata.json`
      );

      meta.folder = project;

      allProjectsMeta.push(meta);
    }

    generateFilters();

    renderProjects();

  } catch (error) {

    console.error(error);

    projectList.innerHTML = `
      <p class="error-text">
        Failed to load projects.
      </p>
    `;
  }
}

// ---------- FILTER -----------
function generateFilters() {

  const tags = new Set();

  allProjectsMeta.forEach(project => {

    if (project.tags) {

      project.tags.forEach(tag => {
        tags.add(tag);
      });
    }
  });

  filterBar.innerHTML = `
    <button
      class="filter-btn active"
      data-filter="ALL"
    >
      ALL
    </button>
  `;

  [...tags]
    .sort()
    .forEach(tag => {

      const button =
        document.createElement("button");

      button.className = "filter-btn";

      button.dataset.filter = tag;

      button.textContent = tag;

      button.onclick = () => {

        currentFilter = tag;

        updateActiveFilter();

        renderProjects();
      };

      filterBar.appendChild(button);
    });

  filterBar
    .querySelector('[data-filter="ALL"]')
    .onclick = () => {

      currentFilter = "ALL";

      updateActiveFilter();

      renderProjects();
    };
}

function updateActiveFilter() {

  document
    .querySelectorAll(".filter-btn")
    .forEach(btn => {

      btn.classList.remove("active");

      if (
        btn.dataset.filter === currentFilter
      ) {
        btn.classList.add("active");
      }
    });
}

function renderProjects() {

  projectList.innerHTML = "";

  const filteredProjects =
    currentFilter === "ALL"

      ? allProjectsMeta

      : allProjectsMeta.filter(project =>
          project.tags?.includes(currentFilter)
        );

  filteredProjects.forEach(meta => {

    const card = document.createElement("div");

    card.className = "card";

    const thumb =
      meta.thumbnail || "fallback.jpg";

    const tagsHTML =
      meta.tags
        ?.map(tag =>
          `<span class="tag">${tag}</span>`
        )
        .join("") || "";

    card.innerHTML = `
      <img
        src="projects/${meta.folder}/${thumb}"
        alt="${meta.name}"
      />

      <div class="card-info">

        <div class="status-badge ${meta.status}">
          ${meta.status}
        </div>

        <h3>${meta.name}</h3>

        <p>${meta.description}</p>

        <div class="tag-container">
          ${tagsHTML}
        </div>

      </div>
    `;

    const image = card.querySelector("img");
    image.onerror = () => {

      image.onerror = null;

      image.src = "assets/no-image.png";

      image.classList.add("fallback-image");
    };

    card.onclick = () => {
      loadProject(meta.folder);
    };

    projectList.appendChild(card);
  });
}

// ---------- PROJECT ----------
async function loadProject(project) {

  showView("project");

  try {

    const meta = await fetchJSON(
      `projects/${project}/metadata.json`
    );

    projectTitle.textContent = meta.name;
    projectDesc.textContent = meta.description;

    versionList.innerHTML = "";

    meta.versions.forEach(version => {

      const card = document.createElement("div");
      card.className = "card";

      const thumb =
        version.files?.images?.[0] ||
        meta.thumbnail;

      card.innerHTML = `
        <img
          src="projects/${project}/${version.id}/${thumb}"
          alt="${version.title}"
        />

        <div class="card-info">
          <h4>${version.title}</h4>
          <p>${version.description}</p>
        </div>
      `;

      const image = card.querySelector("img");

      image.onerror = () => {

        image.onerror = null;

        image.src = "assets/no-image.png";

        image.classList.add("fallback-image");
      };

      card.addEventListener("click", () => {
        loadVersion(project, version.id);
      });

      versionList.appendChild(card);
    });

  } catch (error) {

    console.error(error);

    versionList.innerHTML = `
      <p class="error-text">
        Failed to load project data.
      </p>
    `;
  }
}

// ---------- VERSION ----------
async function loadVersion(project, versionId) {

  showView("version");

  try {

    const meta = await fetchJSON(
      `projects/${project}/metadata.json`
    );

    const version = meta.versions.find(
      v => v.id === versionId
    );

    if (!version) {
      throw new Error("Version not found");
    }

    versionTitle.textContent =
      `${meta.name} — ${version.title}`;

    versionDesc.textContent =
      version.description;

    versionContent.innerHTML = "";

    // ---------- IMAGES ----------
    if (version.files?.images?.length) {

      version.files.images.forEach(img => {

        const image = document.createElement("img");

        image.src =
          `projects/${project}/${versionId}/${img}`;

        image.alt = img;

        image.onerror = () => {

          image.onerror = null;

          image.src = "assets/no-image.png";

          image.classList.add("fallback-image");
        };

        versionContent.appendChild(image);
      });
    }

    // ---------- VIDEOS ----------
    if (version.files?.videos?.length) {

      version.files.videos.forEach(video => {

        const videoElement =
          document.createElement("video");

        videoElement.src =
          `projects/${project}/${versionId}/${video}`;

        videoElement.controls = true;

        videoElement.onerror = () => {
          videoElement.remove();
        };

        versionContent.appendChild(videoElement);
      });
    }

    // ---------- MARKDOWN DOC ----------
    if (version.files?.docs) {

      const docContainer =
        document.createElement("div");

      docContainer.className =
        "readme md-render";

      docContainer.innerHTML =
        "<p>Loading documentation...</p>";

      versionContent.appendChild(docContainer);

      try {

        const response = await fetch(
          `projects/${project}/${versionId}/${version.files.docs}`
        );

        if (!response.ok) {
          throw new Error();
        }

        const md = await response.text();

        docContainer.innerHTML =
          marked.parse(md);

      } catch {

        docContainer.innerHTML = `
          <p>Documentation missing.</p>
        `;
      }
    }

    document
      .getElementById("back-to-project")
      .onclick = () => loadProject(project);

  } catch (error) {

    console.error(error);

    versionContent.innerHTML = `
      <p class="error-text">
        Failed to load version data.
      </p>
    `;
  }
}

// ---------- START ----------
loadHome();