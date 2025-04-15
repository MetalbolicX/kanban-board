type task = {
  id: string,
  description?: string,
}

let create: task => Dom.element = task => {
  Van.Tags.createTag(
    ~tagName="li",
    ~properties={"class": "kanban__task", "draggable": true, "data-id": task.id},
    ~children=[
      Van.Tags.childFrom(
        #Dom(
          Van.Tags.createTag(
            ~tagName="textarea",
            ~properties={
              "class": "kanban__task-description",
              "autocorrect": "true",
              "spellcheck": "true",
              "value": task.description,
            },
          ),
        ),
      ),
      Van.Tags.childFrom(
        #Dom(
          Van.Tags.createTag(
            ~tagName="div",
            ~properties={"class": "kanban__task-actions"},
            ~children=[
              Van.Tags.childFrom(
                #Dom(
                  Van.Tags.createTag(
                    ~tagName="button",
                    ~properties={
                      "class": "kanban__task-delete",
                      "type": "button",
                      "onclick": (evt: Dom.event) => Console.log(evt),
                    },
                    ~children=[Van.Tags.childFrom(#Text("🗑"))],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ],
  )
}
