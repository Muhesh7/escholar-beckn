exports.searchBuilder = (req) => {
    const name = req.body.name
    const code = req.body.code
    const gender = req.body.gender

    console.log("name: ", name)
    console.log("code: ", code)
    console.log("gender: ", gender)
    var intent = {}
    if(name !== undefined && name.length > 0 ) {
        console.log("name")
        intent = {
            item: {
                descriptor: {
                    name: name
                }
            }
        } 
    }
    if(code != undefined && code.length > 0){
        intent = {
            ...intent,
            provider: {
                categories: [
                    {
                        descriptor: {
                            code: code
                        }
                    }
                ]
            }
        }
    }
    if(gender != undefined && gender.length > 0) {
        intent = {
            ...intent,
            fulfillment: {
                customer: {
                    person: {
                      gender: gender
                    }
                }
            }
        }
    }
    return intent
}