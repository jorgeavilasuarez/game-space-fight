/*
 * main functions
 */

// game resources
var g_resources = [
    {name: "bkg1M", type: "image", src: "static/img/bkg1.png"},
    {name: "title", type: "image", src: "static/img/title.png"},
    {name: "play_hover", type: "image", src: "static/img/play_hover.png"},
    {name: "enemy", type: "image", src: "static/img/enemy.png"},
    {name: "Exp_type_A", type: "image", src: "static/img/Exp_type_A.png"}    

];
var jsApp =
        {
            /**
             * Initialize the jsApp
             */
            onload: function()
            {
                // init the video
                if (!me.video.init("jsapp", 480 , 320, true, 'auto', false))
                {
                    alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
                    return;
                }

                // initialize the audio
                me.audio.init("ogg");

                // set all resources to be loaded
                me.loader.onload = this.loaded.bind(this);
                me.loader.preload(g_resources);

                // set the "Loading" Screen Object
                me.state.set(me.state.LOADING, new LoadingScreen());

                // load everything & display a loading screen
                me.state.change(me.state.LOADING);

            },
            /**
             * callback when everything is loaded
             */
            loaded: function()
            {

                me.game.score = 0;
                // set the "Menu" Screen Object
                me.state.set(me.state.MENU, new MenuScreen());
                // set the "Play" Screen Object
                me.state.set(me.state.PLAY, new PlayScreen());
                // set the "Game over" Screen Object
                me.state.set(me.state.GAMEOVER, new GameOverScreen());
                // set the "Score" Screen Object
                me.state.set(me.state.SCORE, new ScoreScreen());
                // set the "Settings" Screen Object
                me.state.set(me.state.SETTINGS, new SettingsScreen());
                // set the "Credits" Screen Object
                me.state.set(me.state.CREDITS, new CreditsScreen());
                // set a global fading transition for the screen
                me.state.transition("fade", "#FFFFFF", 250);
                // disable transition for MENU and GAMEOVER screen
                me.state.setTransition(me.state.MENU, false);
                me.state.setTransition(me.state.GAMEOVER, false);
                
                // draw menu
                me.state.change(me.state.MENU);
                if (!me.device.isMobile) {                    
                }
                me.state.onResume = function() {                   
                    

                };
                me.state.onPause = function() {
                  
                };


            }
        };

// bootstrap :)
window.onReady(function() {
    jsApp.onload();
});

    