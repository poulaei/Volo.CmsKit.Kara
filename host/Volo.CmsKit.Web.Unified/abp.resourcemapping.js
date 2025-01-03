module.exports = {
    aliases: {
        "@node_modules": "./node_modules",
        "@libs": "./wwwroot/libs"
       
    },
    clean: [
        "@libs"
    ],
    mappings: {
        "@node_modules/@progress/kendo-ui/css/**/*": "@libs/kendo/css",
        "@node_modules/@progress/kendo-ui/js/**/*": "@libs/kendo/js"
    }
}