import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useUterpyPlugins() {
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window === 'undefined' || !window.jQuery) return;

      const $ = window.jQuery;

      // Mobile Menu is now handled purely by React in MobileNav.jsx


      // 2. Search Overlay Toggle
      if ($('.search-toggler').length) {
        $('.search-toggler').off('click').on('click', function (e) {
          e.preventDefault();
          $('.search-popup').toggleClass('active');
          $('body').toggleClass('locked');
        });
      }

      // 3. Dynamic Background Images (data-background)
      if ($('[data-background]').length) {
        $('[data-background]').each(function () {
          const bg = $(this).attr('data-background');
          if (bg) {
            $(this).css('background-image', 'url(' + bg + ')');
          }
        });
      }

      // 4. Owl Carousels
      if ($.fn.owlCarousel) {
        if ($('.thm-owl__carousel').length) {
          $('.thm-owl__carousel').each(function () {
            const elm = $(this);
            if (!elm.hasClass('owl-loaded')) {
              const options = elm.data('owl-options');
              elm.owlCarousel(options || {});
            }
          });
        }

        // Testimonial Carousel One
        if ($('.testimonial-carousel__one').length) {
          const myCarousel = $('.testimonial-carousel__one');
          if (myCarousel.hasClass('owl-loaded')) {
            myCarousel.trigger('destroy.owl.carousel');
            myCarousel.removeClass('owl-loaded');
          }
          const textCountWrap = $('.carousel-number-count');
          myCarousel
            .on('initialized.owl.carousel changed.owl.carousel', function (e) {
              const carousel = e.relatedTarget;
              if (!e.namespace || !carousel) return;
              const text =
                '<span class="current-number">' +
                (carousel.relative(carousel.current()) + 1) +
                '</span>' +
                '<span class="sep">/</span>' +
                '<span class="counted-number">' +
                carousel.items().length +
                '</span>';
              textCountWrap.html(text);
            })
            .owlCarousel({
              loop: true,
              items: 3,
              margin: 30,
              dots: true,
              nav: false,
              smartSpeed: 800,
              autoplay: true,
              autoplayTimeout: 5000,
              autoplayHoverPause: true,
              touchDrag: true,
              mouseDrag: true,
              responsive: {
                0: { items: 1 },
                600: { items: 1 },
                768: { items: 1 },
                992: { items: 2 },
                1200: { items: 3 },
              },
            });

          $('.testimonial-carousel-btn .left-btn').off('click').on('click', function (e) {
            e.preventDefault();
            myCarousel.trigger('prev.owl.carousel', [500]);
          });
          $('.testimonial-carousel-btn .right-btn').off('click').on('click', function (e) {
            e.preventDefault();
            myCarousel.trigger('next.owl.carousel', [500]);
          });
        }

        // Testimonial Three Carousel
        if ($('.testimonial-three__carousel').length && !$('.testimonial-three__carousel').hasClass('owl-loaded')) {
          $('.testimonial-three__carousel').owlCarousel({
            loop: true,
            autoplay: true,
            margin: 30,
            nav: false,
            dots: true,
            smartSpeed: 500,
            autoplayTimeout: 10000,
            responsive: {
              0: { items: 1 },
              768: { items: 1 },
              992: { items: 2 },
              1200: { items: 2 },
            },
          });
        }

        if ($('.main-slider-two__carousel').length && !$('.main-slider-two__carousel').hasClass('owl-loaded')) {
          $('.main-slider-two__carousel').owlCarousel({
            loop: true,
            margin: 0,
            nav: true,
            smartSpeed: 500,
            autoHeight: false,
            autoplay: true,
            dots: false,
            animateOut: 'slideOutDown',
            animateIn: 'slideInDown',
            navContainer: '.main-slider-two .custom-nav',
            autoplayTimeout: 10000,
            navText: [
              '<span class="icon-up-arrow1 left"></span>',
              '<span class="icon-up-arrow11"></span>',
            ],
            responsive: {
              0: { items: 1 },
              600: { items: 1 },
              800: { items: 1 },
              1024: { items: 1 },
              1200: { items: 1 },
              1920: { items: 1 },
            },
          });
        }
      }

      // 5. WOW.js entrance animations
      if (window.WOW) {
        new window.WOW({
          boxClass: 'wow',
          animateClass: 'animated',
          offset: 0,
          mobile: true,
          live: true,
        }).init();
      }

      // 6. Odometers / Counters
      if ($('.odometer').length && window.Odometer) {
        $('.odometer').each(function () {
          const countNumber = $(this).data('count');
          $(this).html(countNumber);
        });
      }

      // 7. Accordions / FAQ
      if ($('.accrodion-grp').length) {
        const accrodionGrp = $('.accrodion-grp');
        accrodionGrp.each(function () {
          const accrodionName = $(this).data('grp-name');
          const Self = $(this);
          const accordion = Self.find('.accrodion');
          Self.find('.accrodion-content').hide();
          Self.find('.accrodion.active').find('.accrodion-content').show();
          accordion.each(function () {
            $(this).find('.accrodion-title').off('click').on('click', function () {
              if ($(this).parent().hasClass('active') === false) {
                $('.accrodion-grp[' + 'data-grp-name="' + accrodionName + '"]')
                  .find('.accrodion')
                  .removeClass('active');
                $('.accrodion-grp[' + 'data-grp-name="' + accrodionName + '"]')
                  .find('.accrodion-content')
                  .slideUp();
                $(this).parent().addClass('active');
                $(this).parent().find('.accrodion-content').slideDown();
              }
            });
          });
        });
      }

      // 8. Custom Cursor Tracker
      if ($('.custom-cursor__cursor').length) {
        const cursor = document.querySelector('.custom-cursor__cursor');
        const cursorTwo = document.querySelector('.custom-cursor__cursor-two');
        const links = document.querySelectorAll('a, button, .thm-btn');

        const onMouseMove = (e) => {
          if (cursor && cursorTwo) {
            cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
            cursorTwo.style.left = e.clientX + 'px';
            cursorTwo.style.top = e.clientY + 'px';
          }
        };

        window.removeEventListener('mousemove', onMouseMove);
        window.addEventListener('mousemove', onMouseMove);
      }

      // 9. Preloader Hiding
      if ($('.preloader').length) {
        $('.preloader').fadeOut(300);
      }

      // 10. Sticky Header on Scroll
      const onScroll = () => {
        if ($('.stricked-menu').length) {
          const stricky = $('.stricked-menu');
          if ($(window).scrollTop() > 130) {
            stricky.addClass('stricky-fixed');
          } else {
            stricky.removeClass('stricky-fixed');
          }
        }
        if ($('.scroll-to-top').length) {
          if ($(window).scrollTop() > 100) {
            $('.scroll-to-top').fadeIn(500);
          } else {
            $('.scroll-to-top').fadeOut(500);
          }
        }
      };

      $(window).off('scroll', onScroll).on('scroll', onScroll);

    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);
}
