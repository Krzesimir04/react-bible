export function setErrorMessage(stateFunction){
    const message = "An error occured, please check your Internet connection and try again later, or conntact our support team via e-mail."
    stateFunction(message)
}