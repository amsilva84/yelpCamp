// return a function that accepts a function but catches errors and passes it to next, 
module.exports = func => {
    // return a new function
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
        
}