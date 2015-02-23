;
(function(exports) {
        "use strict";

        Parse.TodoRouter = Parse.Router.extend({

            initialize: function() {
                console.log("initialized");
                this.collection = new Parse.TodoActualList();
                this.view1 = new Parse.TodoView({ //list
                    collection: this.collection
                });
                // this.view2 = new Parse.TodoViewDetail({});//details, need to create this page
                Parse.history.start();
            },
            routes: {
                "*default": "home",
                "details/:item": "showDetail"
            },
            home: function() {
                this.view1.render();
                // this.view2.render(); //Temporary: we'll move the detail view later
            },
            showDetail: function(item) {
                // this.view2.render();
                console.log(item);
            }
        })
        // debugger;
        // Parse.TodoModel = Parse.Model.extend({
        //     defaults: {
        //         "checked": "false",
        //         "title": "No title given.",
        //         "done": "false"
        //     },
        //     validate: function(data) {
        //         // debugger;
        //         var x = data.title.length > 0;

        //         // debugger;
        //         if (!x) {
        //             return "Title Required.";
        //         }
        //     }
        // })


        Parse.TodoView = Parse.TemplateView.extend({
            el: ".container",
            view: "parseToDoapp", //--points to app.html
            events: {
                "submit form": "addTask",
                "change input [name= 'urgent']": "toggleUrgent",
                "change input [name= 'isDone']": "toggleIsDone",
                "keyup .description": "setDescription"
            },
            addTask: function(event) {
                event.preventDefault();
                debugger;
                var data = {
                    description: this.el.querySelector("input[name= 'John']").value
                }
                this.collection.create(data, {
                    validate: true
                });
                console.log("Yay!");
                // debugger;
            },
            getModelAssociatedWithEvent: function(event) {
                var el = event.target,
                    li = $(el).closest('li').get(0),
                    id = li.getAttribute('id'),
                    m = this.collection.get(id);

                return m;

            },
            toggleUrgent: function(event) {
                var m = this.getModelAssociatedWithEvent(event);
                if (m) {
                    m.set('isDone', !m.get('isDone'));
                    if (m.get('isDone')) {
                        m.set('urgent', false);
                    }
                    this.colletion.sort();
                    this.render();
                }
            },
            toggleIsDone: function(event) {
                var m = this.getModelAssociatedWithEvent(event);
                if (m) {
                    m.set('isDone', !m.get('isDone'))
                }
            },
            setDescription: function(event) {
                var m = this.getModelAssociatedWithEvent(event);
                if (m) {
                    m.set('description', event.taget.innerText);
                    m.save();
                }
            }
        })
        Parse.TaskModel = Parse.Object.extend({
            className: "description",
            defaults: {
                isDone: false,
                urgent: false,
                dueDate: null,
                tags: [],
                description: "no description given"
            },
            initialize: function() {
                this.on("change", function() {
                    this.save();
                })
            }
        })
        Parse.TodoActualList = Parse.Collection.extend({
                model: Parse.TaskModel,
                comparator: function(a, b) { //this is to alphabetize the list
                    if (a.get('urgent') && !b.get('urgent') || !a.get('isDone') && b.get('isDone'))
                        return -1;
                    if (a.get('isDone') && !b.get('isDone') || !a.get('urgent') && b.get('urgent'))
                        return 1;

                    return a.get('description') > b.get('description') ? 1 : -1;
                }
        })
        var todos =  new Parse.TodoActualList();

})(typeof module === "object" ? module.exports : window)

            // NEED TO PARSE THE VIEW BELOW AFTER I MAKE SURE IT WORKS
            // Parse.TodoViewDetail = Parse.TemplateView.extend({
            //     el: ".container2",
            //     view: "todoDetails",
            //     initialize: function(options) {//we have to create our own inintialize b/c TemplateView.extend has own initialize function
            //         this.options = options;
            //         this.listenTo(Parse, "newModelForDetailView", this.setModel)//listening to line 78
            //         this.model && this.model.on("change", this.render.bind(this));//
            //         this.collection && this.collection.on("add reset remove", this.render.bind(this));
            //     },
            //     setModel: function(model){
            //         if(this.model === model){//model is NOT line 77
            //             this.model = null;
            //             this.el.innerHTML = "";
            //         } else {
            //             this.model = model;
            //             this.render();
            //         }
            //     }
            // })