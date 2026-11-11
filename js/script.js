
document.addEventListener("DOMContentLoaded", () => {

  const pageLoader = document.getElementById("pageLoader");

  const hidePageLoader = () => {
    window.setTimeout(() => {
      pageLoader?.classList.add("is-hidden");
    }, 1000);
  };

  hidePageLoader();

  // ① スクロール連動メニュー
  const sections = document.querySelectorAll(
    "#about, #history, #works, #skills, #contact"
  );

  const navLinks = document.querySelectorAll("nav a");

  function updateActiveNav() {
    let currentId = "about";
    const checkPosition = 160;

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;

      if (top <= checkPosition) {
        currentId = section.id;
      }
    });

    // ページの一番下まで来たらCONTACTを選択
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2
    ) {
      currentId = "contact";
    }

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + currentId
      );
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  window.addEventListener("load", updateActiveNav);
  window.addEventListener("resize", updateActiveNav);

  updateActiveNav();
  // ② ページトップボタン
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


  // ④ スクロール時のふわっと表示
  document.querySelectorAll(
    ".section-title, .profile-box, .work-card, #contact p, .timeline-item"
  ).forEach(element => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
  });


  // ⑤ 作品カテゴリー切り替え
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
  // ⑥ 作品詳細画面
  const projectModal = document.getElementById("projectModal");
  const closeProjectModal = document.getElementById("closeProjectModal");

  function openProject(projectName) {
    if (!projectModal) return;

    document.querySelectorAll(".project-content").forEach(content => {
      content.style.display = "none";
    });

    const selectedProject =
      document.getElementById(projectName + "Project");

    if (!selectedProject) return;

    selectedProject.style.display = "block";
    projectModal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeProject() {
    if (!projectModal) return;

    projectModal.classList.remove("show");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".work-card[data-project], .skill-item[data-project]").forEach(card => {

    card.addEventListener("click", () => {
      openProject(card.dataset.project);
    });

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProject(card.dataset.project);
      }
    });

  });

  if (closeProjectModal) {
    closeProjectModal.addEventListener("click", closeProject);
  }

  if (projectModal) {
    projectModal.addEventListener("click", event => {
      if (event.target === projectModal) {
        closeProject();
      }
    });
  }

  // ⑦ 詳細画面の画像を拡大表示
  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeModal = document.getElementById("closeModal");
  const prevImageBtn = document.getElementById("prevImageBtn");
  const nextImageBtn = document.getElementById("nextImageBtn");

  if (imageModal && modalImage && closeModal) {
    let imageGallery = [];
    let currentImageIndex = 0;

    function updateImageModal() {
      const total = imageGallery.length;
      if (!total) return;

      const image = imageGallery[currentImageIndex];
      modalImage.src = image.src;
      modalImage.alt = image.alt;

      prevImageBtn?.toggleAttribute("disabled", total <= 1);
      nextImageBtn?.toggleAttribute("disabled", total <= 1);
    }

    function openImageModal(images, index) {
      imageGallery = images;
      currentImageIndex = index;
      updateImageModal();
      imageModal.classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function hideImageModal() {
      imageModal.classList.remove("show");
      if (!projectModal || !projectModal.classList.contains("show")) {
        document.body.style.overflow = "";
      }
    }

    document.querySelectorAll(".project-gallery").forEach(gallery => {
      const images = Array.from(gallery.querySelectorAll("img"));

      images.forEach((img, index) => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => {
          openImageModal(images, index);
        });
      });
    });

    prevImageBtn?.addEventListener("click", () => {
      if (!imageGallery.length) return;
      currentImageIndex = (currentImageIndex - 1 + imageGallery.length) % imageGallery.length;
      updateImageModal();
    });

    nextImageBtn?.addEventListener("click", () => {
      if (!imageGallery.length) return;
      currentImageIndex = (currentImageIndex + 1) % imageGallery.length;
      updateImageModal();
    });

    closeModal.addEventListener("click", hideImageModal);

    imageModal.addEventListener("click", event => {
      if (event.target === imageModal) {
        hideImageModal();
      }
    });
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeProject();
      if (imageModal) {
        imageModal.classList.remove("show");
      }
      if (!projectModal || !projectModal.classList.contains("show")) {
        document.body.style.overflow = "";
      }
    }
  });
});
