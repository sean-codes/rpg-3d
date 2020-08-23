// Load the builder UI
class UI {
   constructor({ 
      onLoad
   }) {
      this.components = {
         ObjectSelector: {}
      }
      
      this.loading = Object.keys(this.components).length * 3
      this.onLoad = onLoad
      this.load()
   }
   
   load() {
      for (let componentName in this.components) {
         console.log('loading', componentName)

         const htmlFile = `./ui/${componentName}/${componentName}.html`
         fetch(htmlFile).then(r => r.text()).then((html) => {
            const template = document.createElement('template')
            template.innerHTML = html
            document.body.appendChild(template)
            this.handleLoadedFile()
         })
         
         const styleTag = document.createElement('link')
         styleTag.rel ="stylesheet"
         styleTag.href = `./ui/${componentName}/${componentName}.css`
         styleTag.addEventListener('load', () => this.handleLoadedFile())
         
         const jsTag = document.createElement('script')
         jsTag.src = `./ui/${componentName}/${componentName}.js`
         jsTag.addEventListener('load', () => this.handleLoadedFile())
         
         document.body.appendChild(styleTag)
         document.body.appendChild(jsTag)
      }
   }
   
   handleLoadedFile() {
      this.loading -= 1
      
      if (!this.loading) {
         this.onLoad()
      }
   }
}
