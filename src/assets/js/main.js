import SmoothScroll from 'smoothscroll-for-websites';
import Pace from 'pace-js';
import { TV } from './core/tv.js';
import { Hamburger } from './core/hamburger.js';
import { ScrollAnimator, FrameAnimator, } from './resources/animators.js';
import { $, $$, WindowUtility, ForUtility, } from './resources/utilities.js';
import { Sign } from './core/sign.js';
import { LottieButton } from './core/lottieButton.js';
import { Lighter } from './core/lighter.js';
import '../css/core/pace.css';
import 'swiper/swiper-bundle.css';
import '../css/main.css';
class Main {
    constructor() {
        this.mTV = new TV();
        this.miscellaneousScrollingAnimator = new ScrollAnimator();
        this.scrollToContinueFrameAnimator = new FrameAnimator();
        this.mHamburger = new Hamburger(this.miscellaneousScrollingAnimator);
        this.mWindowUtility = new WindowUtility();
        this.mSign = new Sign();
        this.mLottieButton = new LottieButton();
        this.mLigher = new Lighter();
        if (!Main.isBeingInstantiated) {
            throw new Error('Constructor called directly');
        }
        Main.isBeingInstantiated = false;
    }
    static braceForInstantiation() {
        Main.isBeingInstantiated = true;
    }
    static async create() {
        ForUtility.addToArrayPrototype();
        SmoothScroll({
            animationTime: 500,
            touchpadSupport: false,
            pulseScale: 6,
        });
        Pace.start({
            ajax: {
                ignoreURLs: [
                    'firestore.googleapis.com',
                    /livereload/,
                ],
            },
        });
        if (document.readyState !== 'complete'
            && document.readyState !== 'interactive') {
            await new Promise((resolve) => $(document).on('DOMContentLoaded', resolve));
        }
        Main.braceForInstantiation();
        const main = new Main();
        await main.addScrollToContinueFrameAnimation();
        await main.addHeaderFrameAnimation();
        await main.addMiscellaneousScrollingAnimations();
        await main.mSign.create();
        await main.mLigher.create();
        await main.mTV.create(main.mLigher.docs);
    }
    async addMiscellaneousScrollingAnimations() {
        const mScrollAnimator = this.miscellaneousScrollingAnimator;
        // meta
        await mScrollAnimator.add({
            type: 'meta',
            index: -2,
            items: {
                onFrame: ((animation, frame) => {
                    const { uid, totalFrames, } = animation.items;
                    let scrollPercent = ((Math.min(Math.max(frame, 0) / (totalFrames - 1), 1)) * 100)
                        .toString();
                    switch (true) {
                        case scrollPercent === 'NaN'
                            || scrollPercent === '0':
                            scrollPercent = '.00';
                            break;
                        case scrollPercent.substr(0, 2) === '0.':
                            scrollPercent = scrollPercent
                                .substr(1)
                                .substring(0, 3);
                            break;
                        case scrollPercent.substring(1, 2) === '.':
                            scrollPercent = scrollPercent
                                .substring(0, 3);
                            break;
                        case scrollPercent === '100':
                            break;
                        default:
                            scrollPercent = scrollPercent
                                .substr(0, scrollPercent.indexOf('.'))
                                .padStart(3, '0');
                    }
                    $('.scrollCounter > h1').textContent = `${scrollPercent}%`;
                    [$('.scrollCounter > h2').textContent] = uid.split(' ');
                }),
            },
        });
        // pre
        await mScrollAnimator.add({
            index: -1,
            type: 'null',
            items: {
                uid: 'portfolio',
                onVisible: () => {
                    this.scrollToContinueFrameAnimator.animatorContainers.forEach((animatorContainer) => this.scrollToContinueFrameAnimator.activate(animatorContainer));
                },
                onHidden: () => {
                    this.scrollToContinueFrameAnimator.animatorContainers.forEach((animatorContainer) => this.scrollToContinueFrameAnimator.deactivate(animatorContainer));
                },
            },
        });
        // custom uid for index 0 (who_am_i)
        await mScrollAnimator.add({
            type: null,
            index: 0,
            items: {
                uid: 'who_am_i?',
            },
        });
        // scale 'screen' up as user scrolls
        await mScrollAnimator.add({
            type: null,
            index: 0,
            items: {
                uid: 'screen_controller',
                totalFrames: 120,
                bezier: [0.75, 0, 0.25, 1],
                onHidden: () => {
                    $('.screen').css({
                        transform: 'scale(1)',
                    });
                    $$('.splash').fastEach((node) => node
                        .css({
                        transform: 'scale(1)',
                    }));
                },
                onFrame: (animation, frame) => {
                    const { totalFrames, } = animation.items;
                    $('.screen').css({
                        transform: `scale(${1 + ((frame / totalFrames) / 2)})`,
                    });
                    $$('.splash').fastEach((node) => node
                        .css({
                        transform: `scale(${1 - ((frame / totalFrames) / 4)})`,
                    }));
                },
            },
        });
        // disable pointer events for index -1 (portfolio) when user is halfway to index 0 (who_am_i)
        await mScrollAnimator.add({
            index: 0,
            type: 'null',
            items: {
                totalFrames: 120,
                onFrame: (animation, frame) => {
                    const { totalFrames, } = animation.items;
                    let pointerEvents = 'none';
                    if (frame > totalFrames / 2) {
                        pointerEvents = 'auto';
                    }
                    mScrollAnimator.animations[0].fastEach((animationObject) => {
                        const { domContent, } = animationObject.items;
                        if (!domContent) {
                            return;
                        }
                        domContent.css({
                            pointerEvents,
                        });
                    });
                },
            },
        });
        // blocks
        await mScrollAnimator.add({
            index: 0,
            type: 'lottie',
            data: await $().getJSON('assets/js/raw/lottie/blocks.json'),
            items: {
                uid: 'blocks',
                respectDevicePixelRatio: false,
                totalFrames: 150,
            },
        });
        // aux about me stuff
        await mScrollAnimator.add({
            index: 0,
            type: 'lottie',
            data: await $().getJSON('assets/js/raw/lottie/aux about me stuff.json'),
            items: {
                uid: 'aux_about_me_stuff',
                respectDevicePixelRatio: false,
                invert: true,
                totalFrames: 120,
            },
        });
        // aux about me dots
        await mScrollAnimator.add({
            index: 0,
            type: 'lottie',
            data: await $().getJSON('assets/js/raw/lottie/aux about me dots.json'),
            items: {
                uid: 'aux_about_me_dots',
                respectDevicePixelRatio: false,
                invert: true,
                totalFrames: 120,
            },
        });
        // // hello
        // await mScrollAnimator.add({
        // 	index: 0,
        // 	type: 'lottie',
        // 	data: await $().getJSON('assets/js/raw/lottie/hello.json'),
        // 	items: {
        // 		uid: 'hello',
        // 		invert: true,
        // 		totalFrames: 120,
        // 	},
        // });
        // overlayController
        await mScrollAnimator.add({
            index: 0,
            type: 'null',
            items: {
                uid: 'overlayController',
                domContent: $('.overlay'),
                totalFrames: 120,
                onFrame: (animation, frame) => {
                    const { domContent, } = animation.items;
                    domContent.css({
                        opacity: Math.min((frame / mScrollAnimator.totalFrames) * 2, 0.5),
                    });
                },
            },
        });
        // white solid background
        await mScrollAnimator.add({
            index: 1,
            type: 'solid',
            items: {
                uid: 'what_now?',
                respectDevicePixelRatio: false,
                totalFrames: 150,
            },
        });
        // aux what now stuff
        await mScrollAnimator.add({
            index: 1,
            type: 'lottie',
            data: await $().getJSON('assets/js/raw/lottie/aux what now stuff.json'),
            items: {
                uid: 'aux_what_now_stuff',
                respectDevicePixelRatio: false,
                invert: true,
                totalFrames: 120,
            },
        });
        // aux what dots
        await mScrollAnimator.add({
            index: 1,
            type: 'lottie',
            data: await $().getJSON('assets/js/raw/lottie/aux what now dots.json'),
            items: {
                uid: 'aux_what_now_dots',
                respectDevicePixelRatio: false,
                invert: true,
                totalFrames: 120,
            },
        });
        // white solid background
        await mScrollAnimator.add({
            index: 2,
            type: 'solid',
            items: {
                uid: 'contact_me',
                respectDevicePixelRatio: false,
                totalFrames: 150,
            },
        });
        // aux contact me stuff
        await mScrollAnimator.add({
            index: 2,
            type: 'lottie',
            data: await $().getJSON('assets/js/raw/lottie/aux contact me stuff.json'),
            items: {
                uid: 'aux_contact_me_stuff',
                respectDevicePixelRatio: false,
                invert: true,
                totalFrames: 120,
            },
        });
        // aux contact me dots
        await mScrollAnimator.add({
            index: 2,
            type: 'lottie',
            data: await $().getJSON('assets/js/raw/lottie/aux contact me dots.json'),
            items: {
                uid: 'aux_contact_me_dots',
                respectDevicePixelRatio: false,
                invert: true,
                totalFrames: 120,
            },
        });
        // lottie button
        const lottieButton = await mScrollAnimator.add({
            index: 2,
            type: 'lottie',
            data: await $().getJSON(window.lottieButtonJsonUrl
                ?? 'assets/js/raw/lottie/email.json'),
            items: {
                uid: 'lottieButton',
                invert: true,
                totalFrames: 120,
            },
        });
        // glow lottie button on hover
        const lottieButtonDomContent = lottieButton.items.domContent;
        const { dpr, resolutionMultiplier, } = mScrollAnimator;
        this.mLottieButton.create({
            domContent: lottieButtonDomContent,
            dpr,
            intent: window.lottieButtonIntent,
            resolutionMultiplier,
        });
    }
    async addScrollToContinueFrameAnimation() {
        const mFrameAnimator = this.scrollToContinueFrameAnimator;
        // scrollToContinue
        await mFrameAnimator.add({
            index: 0,
            type: 'lottie',
            data: await $().getJSON('assets/js/raw/lottie/scroll to continue.json'),
            items: {
                uid: 'scrollToContinue',
                respectDevicePixelRatio: true,
                totalFrames: 180,
                width: {
                    maximum: 1300,
                },
                onVisible: (animation) => {
                    const { onRedraw, } = animation.items;
                    onRedraw(animation);
                    mFrameAnimator.animatorContainersWrapper.addClass('invert');
                },
                onRedraw: (animation) => {
                    const { domContent, } = animation.items;
                    domContent.css({
                        transform: `translateY(${WindowUtility.viewport.height
                            / 3
                            / Math.max(window.devicePixelRatio / 2, 1)}px)`,
                    });
                },
            },
        });
        mFrameAnimator.repeat(0, 180);
    }
    async addHeaderFrameAnimation() {
        const mFrameAnimator = new FrameAnimator();
        // logo
        await mFrameAnimator.add({
            index: 0,
            type: 'null',
            items: {
                uid: 'logo',
                totalFrames: 240,
                offset: 80,
                domContent: $('.logo'),
                bezier: [0.77, 0, 0.175, 1],
                onVisible: (animation) => {
                    const { domContent, } = animation.items;
                    domContent.removeClass('hidden');
                },
                onFrame: (animation, frame) => {
                    const { domContent, totalFrames, } = animation.items;
                    const finalPosition = 120;
                    domContent.css({
                        transform: `translateY(${((frame / totalFrames) * finalPosition) - finalPosition}px)`,
                    });
                },
            },
        });
        // scrollCounter
        await mFrameAnimator.add({
            index: 0,
            type: 'null',
            items: {
                uid: 'scrollCounter',
                totalFrames: 240,
                offset: 40,
                domContent: $('.scrollCounter'),
                bezier: [0.77, 0, 0.175, 1],
                onVisible: (animation) => {
                    const { domContent, } = animation.items;
                    domContent.removeClass('hidden');
                    domContent.css({
                        transform: 'translateY(-10000px)',
                    });
                },
                onFrame: (animation, frame) => {
                    const { domContent, totalFrames, } = animation.items;
                    const finalPosition = -120;
                    domContent.css({
                        transform: `translateY(${((frame / totalFrames) * finalPosition) - finalPosition}px)`,
                    });
                },
            },
        });
        // hamburger menu
        await mFrameAnimator.add({
            index: 0,
            type: 'null',
            data: await this.mHamburger.getLottieData(),
            items: {
                uid: 'hamburger',
                totalFrames: 240,
                offset: 0,
                domContent: this.mHamburger.hamburgerIconDom,
                bezier: [0.77, 0, 0.175, 1],
                onVisible: (animation) => {
                    const { items, data, } = animation;
                    const { domContent, } = items;
                    domContent.removeClass('hidden');
                    domContent.css({
                        transform: 'translateY(-10000px)',
                    });
                    this.mHamburger.create(data);
                },
                onFrame: (animation, frame) => {
                    const { domContent, totalFrames, } = animation.items;
                    const finalPosition = 120;
                    domContent.css({
                        transform: `translateY(${((frame / totalFrames) * finalPosition) - finalPosition}px)`,
                    });
                },
            },
        });
        // to control the various elements size, for css animation on mobile when the url bar appears
        const sizeController = () => {
            const viewportHeight = WindowUtility.viewport.height;
            const innerHeight = WindowUtility.inner.height;
            const header = $('.header.containersWrapper');
            const hamburgerMenu = $('.__hamburgerMenu.containersWrapper');
            if (viewportHeight === innerHeight) {
                header.css({
                    height: viewportHeight,
                });
                hamburgerMenu.css({
                    height: viewportHeight,
                });
            }
            else {
                header.css({
                    height: innerHeight,
                });
                hamburgerMenu.css({
                    height: innerHeight,
                });
            }
        };
        sizeController();
        $(window).on('resize', sizeController);
        mFrameAnimator.animate(0, 240);
    }
}
Main.isBeingInstantiated = false;
(async () => {
    await Main.create();
})();
//# sourceMappingURL=main.js.map