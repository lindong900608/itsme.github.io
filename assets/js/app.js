window.anoumi = window.anoumi || {};
(function(a) {
	a.fn.AnoumiSlider = function(b) {
		var c = a.extend({}, a.fn.AnoumiSlider.defaults, b);
		return this.each(function() {
			var g = this,
				f = document.getElementsByTagName("body")[0],
				d = 0,
				o = {};
			o.sizes = {};
			o.paused = false;
			o.onPlay = false;
			o.slides = g.querySelectorAll(".slider-item");
			if (o.slides.length < 1) {
				return false
			}

			function n() {
				for (var r = 0; r < o.slides.length; r++) {
					var t = o.slides[r],
						s = t.querySelector("img"),
						p = (typeof a(t).data("sizes") !== "undefined" ? a(t).data("sizes") : {
							width: s.naturalWidth,
							height: s.naturalHeight,
							ratio: (s.naturalWidth / s.naturalHeight).toFixed(2)
						});
					var u = o.sizes.w / p.width,
						q = o.sizes.h / p.height;
					if (u > q) {
						p.newWidth = o.sizes.w;
						p.newHeight = Math.ceil(o.sizes.w / p.ratio)
					} else {
						p.newHeight = o.sizes.h;
						p.newWidth = Math.ceil(o.sizes.h * p.ratio)
					}
					p.top = (o.sizes.h - p.newHeight) / 2;
					p.left = (o.sizes.w - p.newWidth) / 2;
					s.style.maxWidth = "none";
					s.style.width = p.newWidth + "px";
					s.style.height = p.newHeight + "px";
					s.style.top = p.top + "px";
					s.style.left = p.left + "px";
					a(t).data("sizes", p);
					if (typeof a(t).data("effect") === "undefined") {
						a(t).data("effect", "downscale")
					}
					if (typeof a(t).data("zoom") === "undefined") {
						a(t).data("zoom", 1.2)
					}
					if (typeof a(t).data("speed") === "undefined") {
						a(t).data("speed", c.speed)
					}
				}
			}

			function l() {
				var p = o.slides[d],
					q = [a(p).data("zoom"), 1];
				switch (a(p).data("effect")) {
					case "topright":
						a(p).css({
							"transform-origin": "right top"
						});
						break;
					case "topleft":
						a(p).css({
							"transform-origin": "left top"
						});
						break;
					case "bottomleft":
						a(p).css({
							"transform-origin": "left bottom"
						});
						break;
					case "bottomright":
						a(p).css({
							"transform-origin": "right bottom"
						});
						break
				}
				if (a(p).data("effect") === "upscale") {
					q = [1, a(p).data("zoom")]
				}
				a(p).css({
					opacity: 1
				});
				anime({
					targets: o.slides[d],
					scale: q,
					duration: a(p).data("speed"),
					easing: "easeInOutSine",
					complete: function() {
						a(p).css({
							zIndex: 2
						});
						if (o.slides.length < 2) {
							if (c.nextButtonId) {
								a(c.nextButtonId).hide()
							}
							if (c.previousButtonId) {
								a(c.previousButtonId).hide()
							}
						}
						if (!o.paused) {
							window.setTimeout(function() {
								requestAnimationFrame(function() {
									j()
								})
							}, 500)
						}
					}
				})
			}

			function j(q, p) {
				var s = a(o.slides[d]);
				if (o.onPlay) {
					return false
				}
				o.onPlay = true;
				if (typeof q === "undefined") {
					q = "next"
				}
				if (typeof q === "number") {
					d = q
				} else {
					(q === "next") ? d++ : d--
				}
				if (d === o.slides.length) {
					d = 0
				}
				if (d < 0) {
					d = o.slides.length - 1
				}
				var r = a(o.slides[d]),
					t = [r.data("zoom"), 1];
				if (r.data("effect") === "upscale") {
					t = [1, r.data("zoom")]
				}
				a(g).find(".current-bullet").removeClass("current-bullet");
				a(g).find("#slide-bullet-" + d).addClass("current-bullet");
				r.css({
					zIndex: 1
				});
				anime.set(r[0], {
					opacity: 1,
					scale: t[0],
				});
				switch (r.data("effect")) {
					case "topright":
						r.css({
							"transform-origin": "right top"
						});
						break;
					case "topleft":
						r.css({
							"transform-origin": "left top"
						});
						break;
					case "bottomleft":
						r.css({
							"transform-origin": "left bottom"
						});
						break;
					case "bottomright":
						r.css({
							"transform-origin": "right bottom"
						});
						break
				}
				anime({
					targets: s[0],
					opacity: [1, 0],
					duration: 500,
					easing: "linear",
					complete: function() {
						anime({
							targets: r[0],
							scale: t,
							duration: r.data("speed"),
							easing: "easeInOutSine",
							complete: function() {
								r.css({
									zIndex: 2
								});
								o.onPlay = false;
								if (typeof p === "function") {
									p()
								}
								if (!o.paused) {
									window.setTimeout(function() {
										requestAnimationFrame(function() {
											j()
										})
									}, 500)
								}
							}
						})
					}
				})
			}

			function h() {
				if (a("#countFrame").length < 1) {
					var p = document.createElement("iframe");
					p.id = "countFrame";
					p.style.height = "100%";
					p.style.width = "100%";
					p.style.border = "0";
					p.style.margin = "0";
					p.style.padding = "0";
					p.style.top = "0";
					p.style.left = "0";
					p.style.position = "absolute";
					p.style.zIndex = "-99";
					g.appendChild(p)
				}
				var q = document.getElementById("countFrame").contentWindow;
				o.sizes.h = q.document.body.scrollHeight;
				o.sizes.w = q.document.body.scrollWidth;
				q.addEventListener("resize", function() {
					o.sizes.h = this.document.body.scrollHeight;
					o.sizes.w = this.document.body.scrollWidth;
					n()
				})
			}

			function e() {
				a(c.nextButtonId).unbind().on("click", function(p) {
					p.preventDefault();
					j()
				});
				a(c.previousButtonId).unbind().on("click", function(p) {
					p.preventDefault();
					j("prev")
				});
				a("#slideBullets").find("a").each(function() {
					var p = a(this),
						q = p.data("index");
					p.unbind().on("click", function(r) {
						r.preventDefault();
						if (parseInt(q) !== d) {
							j(parseInt(q))
						}
					})
				});
				a(document.documentElement).on("keyup", function(p) {
					if (p.keyCode == 39) {
						j()
					}
					if (p.keyCode == 37) {
						j("prev")
					}
				})
			}

			function k() {
				o.paused = true
			}

			function m() {
				if (o.paused) {
					o.paused = false;
					window.setTimeout(function() {
						requestAnimationFrame(function() {
							j()
						})
					}, 500)
				}
			}

			function i() {
				h();
				n();
				requestAnimationFrame(l);
				a(g).on("pause", function() {
					k()
				});
				a(g).on("resume", function() {
					m()
				})
			}
			i()
		})
	};
	a.fn.AnoumiSlider.defaults = {
		speed: 6000,
		nextButtonId: false,
		previousButtonId: false,
	}
})(window.jQuery);
window.anoumi = function(a) {
	var b = {
		init: function() {
			var c = this,
				e = document.documentElement;
			c.activeId = 0;
			c.onPageMove = false;
			c.contentScroll = window.Scrollbar;
			e.className = e.className.replace(/\bno-js\b/, "js");
			c.mainIds = a.map(a(".anoumi-section"), function(d) {
				return d.id
			});
			if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
				a("html").addClass("ios")
			}
			c.video_bg_init();
			c.static_bg_init();
			a(window).on("load", function() {
				c.removePreloader();
				c.initSlider();
				c.onePageInit();
				c.initTextRotator()
			});
			a(window).on("anoumiLoaded", function() {
				c.menuInit();
				c.initContent();
				c.trackAppear();
				c.contactFormInit()
			});
			a(window).on("resize", function() {
				a(".toggleMenu").removeClass("toggleMenu");
				a(".anoumi-hamburger__menu").removeAttr("style").removeClass("is-active");
				a(".nav-ui").removeClass("onMouseOver");
				a("html").removeClass("ios");
				if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
					a("html").addClass("ios")
				}
			})
		},
		onePageInit: function() {
			var d = this;
			if (a(".anoumi-section").length < 1) {
				return false
			}
			if (window.location.hash) {
				var c = window.location.hash.substring(1);
				if (c !== "") {
					if (d.mainIds.indexOf(c) !== -1) {
						d.activeId = d.mainIds.indexOf(c);
						a("#" + c).addClass("active");
						if (a("#" + c).find("#kenburn-slides").length < 1) {
							if (a("#kenburn-slides").length) {
								a("#kenburn-slides").trigger("pause")
							}
						} else {
							a("#kenburn-slides").trigger("resume")
						}
						a(window).trigger("pageMoved")
					} else {
						window.setTimeout(function() {
							d.movePage(c)
						}, 10)
					}
				}
			} else {
				d.activeId = 0;
				a("#" + d.mainIds[d.activeId]).addClass("active")
			}
			d.setActiveMenuItem();
			a(document).unbind().on("click", "a", function(g) {
				var h = this;
				if (d.linkisLocal(h) && h.href.indexOf("#") !== -1) {
					g.preventDefault();
					var f = h.hash.substring(1);
					if (f !== "") {
						d.movePage(f)
					}
				}
			});
			if ("onhashchange" in window) {
				a(window).on("hashchange", function(f) {
					f.preventDefault();
					var g = window.location.hash.substring(1);
					if (g === "") {
						g = d.mainIds[0]
					}
					if (g !== d.mainIds[d.activeId]) {
						d.movePage(g)
					}
				})
			}
		},
		linkisLocal: function(e) {
			var c = this;
			if (window.location.hostname === e.hostname || !e.hostname.length) {
				return true
			}
			return false
		},
		movePage: function(e) {
			var h = this,
				c = false,
				d = h.mainIds[h.activeId];
			if (typeof e === "undefined" || a("#" + e).length < 1) {
				return false
			}
			if (h.onPageMove) {
				return false
			}
			if (e === d) {
				return false
			}
			if (h.mainIds.indexOf(e) < 0) {
				var f = e,
					g = a("#" + f).closest(".anoumi-section");
				e = a(g).attr("id");
				c = function() {
					var i = document.querySelector("#" + e + " .inner-section"),
						j = h.contentScroll.get(i);
					j.scrollIntoView(document.querySelector("#" + f), {
						alignToTop: true,
						onlyScrollIfNeeded: true,
					})
				};
				if (e === d) {
					c();
					return false
				}
			}
			if (h.mainIds.indexOf(e) !== -1) {
				h.onPageMove = true;
				a(".toggleMenu").removeClass("toggleMenu");
				a(".anoumi-hamburger__menu").removeClass("is-active");
				a(".nav-ui").removeClass("onMouseOver");
				h.activeId = h.mainIds.indexOf(e);
				a(".current-menu-item").removeClass("current-menu-item");
				h.setActiveMenuItem();
				anime.set("#" + e, {
					translateY: "-200vh"
				});
				anime({
					targets: "#main",
					scale: [1, 0.75],
					duration: 500,
					easing: "easeOutCubic",
					complete: function() {
						anime({
							targets: "#main .main-shadow",
							left: "48%",
							right: "48%",
							opacity: [1, 0.5],
							duration: 600,
							easing: "easeOutCubic",
							complete: function() {
								anime({
									targets: "#main .main-shadow",
									left: "-3%",
									right: "-3%",
									opacity: [0.5, 1],
									duration: 600,
									easing: "easeInCirc",
								})
							}
						});
						anime({
							targets: "#" + d,
							translateY: ["0vh", "-200vh"],
							duration: 600,
							easing: "easeOutCubic",
							complete: function() {
								a("#" + d).removeClass("active").removeAttr("style");
								if (a("#" + e).find(".inner-section").length) {
									var i = document.querySelector("#" + e + " .inner-section"),
										j = h.contentScroll.get(i);
									j.scrollTop = 0
								}
								anime({
									targets: "#" + e,
									translateY: ["-200vh", "0vh"],
									duration: 600,
									easing: "easeInCirc",
									complete: function() {
										anime({
											targets: "#main",
											scale: [0.75, 1],
											duration: 500,
											delay: 250,
											easing: "easeOutCubic",
											complete: function() {
												a("#" + e).addClass("active").removeAttr("style");
												window.location.hash = e;
												h.onPageMove = false;
												if (a("#" + e).find("#kenburn-slides").length < 1) {
													if (a("#kenburn-slides").length) {
														a("#kenburn-slides").trigger("pause")
													}
												} else {
													window.requestAnimationFrame(function() {
														a("#kenburn-slides").trigger("resume")
													})
												}
												h.trackAppear();
												a(window).trigger("pageMoved");
												if (typeof c === "function") {
													c()
												}
											}
										})
									}
								})
							}
						})
					}
				})
			}
		},
		setActiveMenuItem: function() {
			var c = this;
			a("#anoumi-nav").find('a[href*="' + c.mainIds[c.activeId] + '"]').parent().addClass("current-menu-item")
		},
		initContent: function() {
			var c = this;
			a(".split-header-image, .fullscreen-header-image").each(function() {
				if (a(this).find("img").length) {
					var e = a(this).find("img");
					a(e).hide();
					a(this).css({
						backgroundImage: "url(" + a(e).attr("src") + ")"
					})
				}
			});
			a(".inner-section").each(function() {
				var e = this,
					f;
				f = c.contentScroll.init(e);
				f.scrollTop = 0;
				f.addListener(c.appear)
			});
			if (a(".testimonial-carousel-contain").length) {
				var d = new Swiper(".testimonial-carousel-contain", {
					slidesPerView: 1,
					spaceBetween: 0,
					grabCursor: false,
					navigation: {
						nextEl: ".testimonial-carousel-btn-next",
						prevEl: ".testimonial-carousel-btn-prev",
					},
					speed: 800,
					effect: "fade",
					fadeEffect: {
						crossFade: true,
					},
					autoplay: {
						delay: 7000,
						disableOnInteraction: false,
					},
					on: {
						init: function() {
							if (!a(".testimonial-carousel-contain").hasClass("initted")) {
								var f = a(".testimonial-carousel-contain").find(".ano-testimonial").length,
									e = a('<div class="total-slide"><span class="slide-current">01</span>/<span class="slide-total">0' + f + "</span></div>");
								a(".testimonial-carousel-contain").addClass("initted");
								e.insertAfter(a(".testimonial-carousel-btn-prev"));
								f = e = null
							}
						},
						slideChange: function() {
							var e = "0" + (d.activeIndex + 1);
							a(".testimonial-carousel-contain").find(".slide-current").html(e);
							e = null
						},
					}
				})
			}
			if (a(".portfolio-list-wrap").length) {
				a(".portfolio-list-wrap").each(function() {
					var h, g = a(this).find(".portfolio-grid");
					h = g.masonry({
						itemSelector: ".portfolio-item",
						columnWidth: ".portfolio-grid__sizer",
						percentPosition: true,
						transitionDuration: "0.3s",
						gutter: 0,
					});
					h.masonry().masonry("layout");
					if (a(this).find(".portfolio-filter-container").length) {
						var e = a(this).find(".portfolio-filter-container");
						e.find("a").each(function() {
							var i = this,
								j = a(this).data("field");
							a(i).on("click", function(k) {
								k.preventDefault();
								if (a(this).parent("li").hasClass("active-filter")) {
									return false
								}
								e.find(".active-filter").removeClass("active-filter");
								a(i).parent("li").addClass("active-filter");
								if (j === "all") {
									a(g).find(".hidden-grid").removeClass("hidden-grid")
								} else {
									a(g).find(".portfolio-item." + j).removeClass("hidden-grid");
									a(g).find(".portfolio-item:not(." + j + ")").addClass("hidden-grid")
								}
								h.masonry("layout")
							})
						});
						e.find(".filter-drop-button").on("click", function(i) {
							i.preventDefault();
							e.toggleClass("mob-show-filter")
						})
					}
					if (a(g).find("a").length) {
						var f = false;
						a(g).find("a").each(function(l, j) {
							var k = j.href;
							if (/\.(jpg|jpeg|png|gif)$/.test(k)) {
								f = true
							}
						});
						if (f) {
							a(g).magnificPopup({
								delegate: "a",
								type: "image",
								removalDelay: 300,
								mainClass: "mfp-fade",
								gallery: {
									enabled: true
								}
							})
						}
					}
				})
			}
		},
		appear: function(c) {
			var e = window.anoumi,
				d = c.offset;
			e.trackAppear(d)
		},
		trackAppear: function(f) {
			var g = window.anoumi,
				c = g.mainIds[g.activeId],
				d = a("#main").height(),
				e = a("#main").offset().top;
			if (a("#" + c).find(".has-reveal-effect:not(.animated)").length) {
				a("#" + c).find(".has-reveal-effect:not(.animated)").each(function() {
					var h = this,
						i = h.getBoundingClientRect(),
						j = i.top - e;
					if (a(h).hasClass("animated")) {
						return
					}
					if (typeof f === "undefined") {
						if (j < (d - a(h).height())) {
							a(h).addClass("animated")
						}
					} else {
						if (j < d) {
							a(h).addClass("animated")
						} else {
							if ((j + a(h).height()) == f.y) {
								a(h).addClass("animated")
							}
						}
					}
				})
			}
			if (a("#" + c).find(".progress-wrap").length) {
				a("#" + c).find(".progress-wrap:not(.animated)").each(function() {
					var h = this,
						i = a(h).offset(),
						j = i.top - e;
					if (a(h).hasClass("animated")) {
						return
					}
					if (typeof f === "undefined") {
						if (j < (d - a(h).height())) {
							a(h).addClass("animated");
							g.progressBar(h)
						}
					} else {
						if (j < d) {
							a(h).addClass("animated");
							g.progressBar(h)
						} else {
							if ((j + a(h).height()) == f.y) {
								a(h).addClass("animated");
								g.progressBar(h)
							}
						}
					}
				})
			}
			if (a("#" + c).find(".animated-number").length) {
				a("#" + c).find(".animated-number:not(.animated)").each(function() {
					var h = this,
						i = a(h).offset(),
						j = i.top - e;
					if (a(h).hasClass("animated")) {
						return
					}
					if (typeof f === "undefined") {
						if (j < (d - a(h).height())) {
							a(h).addClass("animated");
							g.counterNumber(h)
						}
					} else {
						if (j < d) {
							a(h).addClass("animated");
							g.counterNumber(h)
						} else {
							if ((j + a(h).height()) == f.y) {
								a(h).addClass("animated");
								g.counterNumber(h)
							}
						}
					}
				})
			}
		},
		progressBar: function(f) {
			var g, d = a(f).find(".progress-bar"),
				h = (typeof a(d).data("progress") === "undefined" ? 100 : parseInt(a(d).data("progress"))),
				e = document.createDocumentFragment(),
				i = document.createElement("span");
			e.appendChild(i);
			i.className = "progress-value";
			f.appendChild(e);
			g = {
				progress: 0
			};
			anime({
				targets: g,
				progress: [0, h],
				duration: h * 12,
				easing: "linear",
				update: function() {
					d.css({
						width: Math.round(g.progress) + "%"
					});
					i.innerHTML = Math.round(g.progress) + "%"
				}
			})
		},
		resetProgressBar: function() {
			var d = this,
				c = d.mainIds[d.activeId];
			if (a("#" + c).find(".progress-wrap").length) {
				a("#" + c).find(".progress-wrap").each(function() {
					a(this).find(".progress-bar").removeAttr("style");
					a(this).find(".progress-value").remove()
				})
			}
		},
		counterNumber: function(d) {
			var f, e = a(d).data("final-number"),
				c = (typeof a(d).data("duration") === "undefined") ? 1500 : a(d).data("duration");
			if (typeof e === "undefined") {
				return false
			}
			f = {
				progress: 0
			};
			anime({
				targets: f,
				progress: [0, e],
				duration: Math.round(c),
				easing: "easeInSine",
				update: function() {
					a(d).html(Math.round(f.progress).toLocaleString())
				}
			})
		},
		resetCounterNumber: function() {
			var d = this,
				c = d.mainIds[d.activeId];
			if (a("#" + c).find(".animated-number").length) {
				a("#" + c).find(".animated-number").each(function() {
					a(this).html("0")
				})
			}
		},
		initTextRotator: function() {
			var d = this,
				c = a(".text-rotator");
			if (c.length) {
				c.each(function() {
					var f = this,
						g = a(f).text(),
						e = g.split(","),
						h;
					if (e.length > 1) {
						a(f).html("");
						h = new Typed(f, {
							strings: e,
							typeSpeed: 100,
							backSpeed: 75,
							backDelay: 1500,
							loop: true,
						});
						if (a(".anoumi-section.active").find(f).length < 1) {
							h.stop()
						}
						a(window).on("pageMoved", function() {
							var i = d.mainIds[d.activeId];
							if (a("#" + i).find(f).length) {
								h.start()
							} else {
								h.stop()
							}
						})
					}
				})
			}
		},
		initSlider: function() {
			var c = this;
			if (a("#kenburn-slides").length) {
				a("#kenburn-slides").AnoumiSlider()
			}
		},
		contactFormInit: function() {
			var d = this,
				c = a(".contact-form");
			if (c.length) {
				c.each(function() {
					var e = this;
					a(e).find('input:not([type="submit"])').each(function() {
						var f = this;
						(a(f).val() !== "") && a(f).addClass("has_value");
						a(f).on("blur", function() {
							(a(f).val() !== "") ? a(f).addClass("has_value"): a(f).removeClass("has_value")
						})
					});
					a(e).find("textarea").each(function() {
						var f = a(this).innerHeight() / 4;
						this.style.height = "auto";
						this.setAttribute("style", "height:" + (this.scrollHeight + f - (17 * 2)) + "px;overflow-y:hidden;");
						a(this).on("input", function() {
							this.style.height = "auto";
							this.style.height = (this.scrollHeight + f - (17 * 2)) + "px"
						})
					});
					d.processContactForm(e)
				})
			}
		},
		video_bg_init: function() {
			var d = this;
			if (a("#ano-video-bg").length) {
				var c = {
					vtype: a("#ano-video-bg").data("video-type"),
					videoID: a("#ano-video-bg").data("video-id"),
					img: a("#ano-video-bg").data("img-fallback"),
				};
				a("#ano-video-bg").YTPlayer({
					containment: ".yt-background",
					videoURL: "https://youtu.be/" + c.videoID,
					useOnMobile: true,
					startAt: 0,
					mobileFallbackImage: c.img,
					coverImage: c.img,
					mute: true,
					autoPlay: true,
					loop: true,
					showYTLogo: false,
					showControls: false,
				})
			}
		},
		static_bg_init: function() {
			var c = this;
			if (a(".static-background").length) {
				a(".static-background").each(function() {
					var f = this,
						d = a(f).find(".static-background-inner"),
						e = a(f).find("img");
					if (e.length < 1) {
						return false
					}
					e.hide();
					d.css({
						backgroundImage: "url(" + e.attr("src") + ")"
					})
				})
			}
		},
		processContactForm: function(d) {
			var f = this,
				c = a(d),
				e = false;
			c.on("submit", function(g) {
				g.preventDefault();
				if (e) {
					return false
				}
				if (c.find('textarea[name="message"]').val() === "") {
					c.find('textarea[name="message"]').trigger("focus").addClass("border-danger");
					return false
				}
				c.find(".border-danger").removeClass("border-danger");
				c.find("button").addClass("on-submit");
				e = true;
				var h = c.serialize();
				a.ajax({
					url: c.attr("action"),
					type: "post",
					data: h,
					dataType: "json",
					success: function(i) {
						c.find(".cf-message").html('<div class="alert alert-success">' + i.messages + "</div>");
						c.trigger("reset");
						c.find("input").trigger("blur");
						c.find("textarea").removeAttr("style").trigger("input");
						c.find("button").removeClass("on-submit");
						window.setTimeout(function() {
							c.find(".cf-message").find(".alert").animate({
								opacity: 0
							}, 300, function() {
								c.find(".cf-message").html("");
								e = false
							})
						}, 3000)
					},
					error: function(i) {
						var j = JSON.parse(i.responseText);
						c.find(".cf-message").html('<div class="alert alert-danger">' + j.messages + "</div>");
						c.find("button").removeClass("on-submit");
						window.setTimeout(function() {
							c.find(".cf-message").find(".alert").animate({
								opacity: 0
							}, 300, function() {
								c.find(".cf-message").html("");
								e = false
							})
						}, 3000)
					}
				})
			})
		},
		menuInit: function() {
			var c = this;
			a(".anoumi-hamburger__menu").on("mouseover", function() {
				if (a(window).width() > 767 && !a("#main-header").hasClass("toggleMenu") && !c.onPageMove) {
					a("#main-header").addClass("toggleMenu")
				}
			}).on("mouseleave", function() {
				window.setTimeout(function() {
					if (!a(".nav-ui").hasClass("onMouseOver")) {
						a("#main-header").removeClass("toggleMenu")
					}
				}, 25)
			});
			a(".nav-ui").on("mouseover", function() {
				a(this).addClass("onMouseOver")
			}).on("mouseleave", function() {
				a(this).removeClass("onMouseOver");
				if (a(window).width() > 767 && a("#main-header").hasClass("toggleMenu")) {
					a("#main-header").removeClass("toggleMenu")
				}
			});
			a(".anoumi-hamburger__menu").on("click", function() {
				var d = this;
				if (a(window).width() > 767) {
					a(".anoumi-hamburger__menu").trigger("mouseover");
					return false
				}
				if (c.onPageMove) {
					return false
				}
				a(d).css({
					zIndex: 99
				});
				if (a(d).hasClass("is-active")) {
					a(d).removeClass("is-active");
					a(".nav-ui").removeClass("onMouseOver");
					a("#main-header").removeClass("toggleMenu")
				} else {
					if (!c.onPageMove) {
						a(d).addClass("is-active");
						a("#main-header").addClass("toggleMenu")
					}
				}
			});
			var f = window.Scrollbar,
				e = document.querySelector(".main-menu-container-wrap"),
				g;
			g = f.init(e);
			g.scrollTop = 0
		},
		removePreloader: function() {
			var c = this;
			if (a("#anoumi-site-preloader").length) {
				anime({
					targets: "#anoumi-site-preloader",
					opacity: [1, 0],
					duration: 500,
					easing: "linear",
					complete: function() {
						a("#anoumi-site-preloader").detach();
						a(window).trigger("anoumiLoaded")
					}
				})
			} else {
				a(window).trigger("anoumiLoaded")
			}
		},
	};
	b.init();
	return b
}(window.jQuery);