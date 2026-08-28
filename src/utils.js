export function setErrorMessage(stateFunction, errorMessage = null){
    const message = errorMessage || "An error occured, please check your Internet connection and try again later, or conntact our support team via e-mail."
    stateFunction(()=>message)
}

export const LIST_OF_LANGUAGES = [
    {code: 'eng', name: "English"},
    {code: 'pol', name: "Polish"},
    {code: 'fra', name: "French"},
    {code: 'deu', name: "German"},
    {code: 'spa', name: "Spanish"},
]