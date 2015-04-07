var EnemyEntity = me.ObjectEntity.extend(
        {
            /**
             * Constructor.
             * @param {int} object description.
             * @param {int} y descripcion.             
             * @constructor
             */
            init: function(x, y)
            {
                // enemy entity settings
                var settings = {};
                settings.name = "EnemyEntity";
                settings.image = me.loader.getImage("enemy");
                settings.spritewidth = 45;
                settings.spriteheight = 42;
                settings.x = x;
                settings.y = y;
                settings.type = me.game.ENEMY_OBJECT;
                // call parent constructor
                this.parent(x, y, settings);
                // add animation with all sprites
                this.renderable.addAnimation("flying", null, 0.2);
                this.renderable.addAnimation("Exp_type_A", null, 0.2);
                this.renderable.setCurrentAnimation("flying");
                // init variables
                this.gravity = 0;
                this.alwaysUpdate = true;
                // set the default horizontal speed (accel vector)
                this.setVelocity(4, 0);
                this.anchorPoint.set(0.0, 0.0);
                // enable collision
                this.collidable = true;

                /*eventos touch*/
                if (me.device.touch) {
                    me.input.registerPointerEvent("touchmove", this, this.clicked.bind(this));
                    me.input.registerPointerEvent("touchstart", this, this.clicked.bind(this));
                } else {
                    me.input.registerPointerEvent("click", this, this.clicked.bind(this));
                }


            },
            /**
             * clicked
             * @param {object} evento description.
             */
            clicked: function(evento)
            {
                me.game.showhelp = false;
                this.remove();

            },
            /**
             * update function
             */
            update: function()
            {
                // call parent constructor
                this.parent(this);
                // calculate velocity
                this.vel.x -= this.accel.x * me.timer.tick;
                // check & update missile movement
                this.computeVelocity(this.vel);
                this.pos.add(this.vel);
                me.game.collide(this);
                return true;
            },
            /**
             * On Collision.
             * @param {object} objA description.
             * @param {object} objB description.
             */
            onCollision: function(objA, objB) {
                this.remove();
            },
            /**
             * remove.
             */
            remove: function() {
                var implosion = new ImplosionEntity(this.pos.x - 25, this.pos.y - 25, 2);
                me.game.add(implosion, 15);
                me.game.sort();
                if (me.device.touch) {
                    me.input.releasePointerEvent("touchmove", this, this.clicked.bind(this));
                    me.input.releasePointerEvent("touchstart", this, this.clicked.bind(this));
                } else {
                    me.input.releasePointerEvent("click", this, this.clicked.bind(this));
                }
                me.game.remove(this, true);
                me.game.score++;

            }
        });

/*
 * enemy fleet
 */
var EnemyFleet = Object.extend(
        {
            /**
             * @constructor
             */
            init: function()
            {
                // init variables
                this.fps = 0;
                this.alwaysUpdate = true;
            },
            /**
             * update function
             */
            update: function()
            {

                /*enemigos*/
                if ((this.fps++) % 20 === 0)
                {

                    var x = me.video.getWidth();
                    var y = parseInt(Math.random() * (me.video.getHeight() - 42));
                    var enemigo = me.entityPool.newInstanceOf("EnemyEntity", x, y);
                    me.game.add(enemigo, 10);
                    me.game.sort();
                }
                return true;
            }
        });

/*
 * implosion animation
 */
var ImplosionEntity = me.ObjectEntity.extend(
        {
            /**
             * @param {int} object description.
             * @param {int} y descripcion.
             * @param {int} tipo description.
             * @constructor
             */
            init: function(x, y, tipo)
            {
                // call parent constructor
                var settings = {};
                settings.name = "ImplosionEntity";
                settings.image = me.loader.getImage("Exp_type_A");
                settings.spritewidth = 128;
                settings.spriteheight = 128;
                settings.x = x;
                settings.y = y;

                // call parent constructor
                this.parent(x, y, settings);


                if (tipo === 2) {
                    this.renderable.addAnimation("Exp_type_A", null, 0.1);

                    try {
                        // play sound
                        me.audio.play("implosion");
                    } catch (e) {
                        console.log(e);
                    }
                    // set animation
                    this.renderable.setCurrentAnimation("Exp_type_A", (function() {
                        me.game.remove(this, true);
                        return false;
                    }).bind(this));

                }

            }
        });