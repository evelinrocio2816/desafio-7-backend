const {Command}= require("commander")
const program = new Command()

//1- Comando, 2- descripción, 3- Valor por default
program
    .option("--mode <mode>", "modo de trabajo", "produccion")
program.parse();

module.exports = program; 