
exports.searchBuilder = (req) => {
    const name = req.query.name
    const code = req.query.code
    const gender = req.query.gender
    var intent = {}
    if(name !== undefined) {
        intent = {
            item: {
                descriptor: {
                    name: name
                }
            }
        } 
    }
    if(code != undefined){
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
    if(gender != undefined) {
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