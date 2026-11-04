
document.addEventListener("DOMContentLoaded", () => {

  // ① スクロール連動メニュー
  const sections = document.querySelectorAll(
    "#about, #history, #works, #skills, #contact"
  );
  const navLinks = document.querySelectorAll("nav a");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  }, {
    rootMargin: "-30% 0px -60% 0px"
  });

  sections.forEach(section => {
    sectionObserver.observe(section);
  });


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


  // ③ 作品画像の拡大表示
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

    imageModal.addEventListener("click", (event) => {
      if (event.target === imageModal) {
        hideModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideModal();
      }
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

});
