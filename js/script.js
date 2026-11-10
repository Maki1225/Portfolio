
document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // ① スクロール連動メニュー
  // ==============================

  const navLinks = document.querySelectorAll("nav a");

  function updateActiveNav() {
    const sections = [
      document.querySelector("#about"),
      document.querySelector("#works"),
      document.querySelector("#skills"),
      document.querySelector("#contact")
    ].filter(Boolean);

    let currentSection = "about";

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) {
        currentSection = section.id;
      }
    });

    // HISTORYはABOUT内の小見出しとして扱う
    const history = document.querySelector("#history");

    if (history) {
      const historyTop = history.getBoundingClientRect().top + window.scrollY;

      if (window.scrollY >= historyTop - 150) {
        currentSection = "history";
      }

      const works = document.querySelector("#works");

      if (works && window.scrollY >= works.offsetTop - 150) {
        currentSection = "works";
      }
    }

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + currentSection
      );
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();


  // ==============================
  // ② ページトップボタン
  // ==============================

  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  // ==============================
  // ③ 作品画像の拡大表示
  // ==============================

  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeModal = document.getElementById("closeModal");

  if (imageModal && modalImage && closeModal) {

    document.querySelectorAll(".work-card img").forEach(img => {
      img.addEventListener("click", () => {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        imageModal.classList.add("show");
      });
    });

    function hideModal() {
      imageModal.classList.remove("show");
    }

    closeModal.addEventListener("click", hideModal);

    imageModal.addEventListener("click", event => {
      if (event.target === imageModal) {
        hideModal();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        hideModal();
      }
    });
  }


  // ==============================
  // ④ スクロール時のふわっと表示
  // ==============================

  document.querySelectorAll(
    ".section-title, .profile-box, .work-card, #contact p, .timeline-item"
  ).forEach(element => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
  });


  // ==============================
  // ⑤ 作品カテゴリー切り替え
  // ==============================

  const filterButtons = document.querySelectorAll(".filter-btn");
  const workCards = document.querySelectorAll(".work-card");

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      const selectedCategory = button.dataset.filter;

      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      workCards.forEach(card => {

        const category = card.dataset.category;

        if (
          selectedCategory === "all" ||
          category === selectedCategory
        ) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }

      });

    });

  });


  // ==============================
  // ⑥ プロジェクト詳細モーダル
  // ==============================

  const projectModal = document.getElementById("projectModal");
  const closeProjectModal = document.getElementById("closeProjectModal");

  const projectCards = document.querySelectorAll(
    ".work-card[data-project]"
  );

  const projectContents = document.querySelectorAll(
    ".project-content"
  );

  function openProject(projectName) {

    if (!projectModal) return;

    // すべての詳細を非表示
    projectContents.forEach(content => {
      content.style.display = "none";
    });

    // 選択された作品だけ表示
    const selectedProject = document.getElementById(
      projectName === "audio"
        ? "audioProject"
        : projectName === "planner"
          ? "plannerProject"
          : ""
    );

    if (!selectedProject) return;

    selectedProject.style.display = "block";

    // モーダルを開く
    projectModal.classList.add("show");

    // 背景のスクロールを停止
    document.body.style.overflow = "hidden";
  }


  function closeProject() {

    if (!projectModal) return;

    projectModal.classList.remove("show");

    // 背景のスクロールを戻す
    document.body.style.overflow = "";

  }


  // 作品カードをクリックしたとき
  projectCards.forEach(card => {

    card.addEventListener("click", () => {
      openProject(card.dataset.project);
    });

    // Enterキー・スペースキーでも開ける
    card.addEventListener("keydown", event => {

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProject(card.dataset.project);
      }

    });

  });


  // ×ボタンで閉じる
  if (closeProjectModal) {
    closeProjectModal.addEventListener("click", closeProject);
  }


  // 背景部分をクリックしても閉じる
  if (projectModal) {

    projectModal.addEventListener("click", event => {

      if (event.target === projectModal) {
        closeProject();
      }

    });

  }


  // Escapeキーでも閉じる
  document.addEventListener("keydown", event => {

    if (
      event.key === "Escape" &&
      projectModal &&
      projectModal.classList.contains("show")
    ) {
      closeProject();
    }

  });

});
