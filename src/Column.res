type column = {
  id: string,
  title: string,
  tasks?: array<Task.task>,
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
              if column.id == "todo" {
                Van.Tags.childFrom(#Dom(
                Van.Tags.createTag(~tagName="button")
                ))
              } else {
                Van.Tags.childFrom(#Nil(Null))
              },
              Van.Tags.childFrom(
                #Dom(Van.Tags.createTag(~tagName="mmenu", ~properties={"class": "kanban__tasks"})),
              ),
            ],
          ),
        ),
      ),
    ],
  )
}
