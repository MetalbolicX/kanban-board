type column = {
  id: string,
  title: string,
  tasks?: array<Task.task>,
}

@val @scope("document") @return(nullable)
external querySelector: string => option<Dom.element> = "querySelector"

@val @scope(("window", "crypto"))
external randomUUID: unit => string = "randomUUID"

let handleAddTask: string => unit = columnId => {
  switch querySelector(`#${columnId} .kanban__tasks`) {
  | Some(el) => Van.add(el, Task.create({id: randomUUID(), description: ""}))->ignore
  | None => Console.error(`The column with selector: #${columnId} .kanban__tasks does not exist.`)
  }
}

let create: column => Dom.element = column => {
  Van.Tags.createTag(
    ~tagName="section",
    ~properties={"class": "kanban__column", "id": column.id},
    ~children=[
      Van.Tags.childFrom(
        #Dom(
          Van.Tags.createTag(
            ~tagName="header",
            ~properties={"class": "kanban__title"},
            ~children=[
              Van.Tags.childFrom(
                #Dom(
                  Van.Tags.createTag(
                    ~tagName="h2",
                    ~children=[Van.Tags.childFrom(#Text(column.title))],
                  ),
                ),
              ),
              Van.Tags.childFrom(
                if column.id == "todo" {
                  #Dom(
                    Van.Tags.createTag(
                      ~tagName="button",
                      ~properties={
                        "class": "kanban__add-task",
                        "type": "button",
                        "onclick": _ => handleAddTask(column.id),
                      },
                      ~children=[Van.Tags.childFrom(#Text("+ Add"))],
                    ),
                  )
                } else {
                  #Nil(Null)
                },
              ),
            ],
          ),
        ),
      ),
      Van.Tags.childFrom(
        #Dom(Van.Tags.createTag(~tagName="menu", ~properties={"class": "kanban__tasks"})),
      ),
    ],
  )
}
