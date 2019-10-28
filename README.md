# mebuie.github.io
Welcome to MarkOS – my personal website and development playground. 

My personal website has always been primarily a medium to learn new skills and as a result, has gone through many iterations throughout the years. Starting out with Bootstrap 3, the site was rebuilt after learning how to create lightweight responsive websites without relying on bulky libraries. Today’s iteration departs from the usual scrolling website and leverages the Dojo framework to emulate an operating systems. 

The vision of this project is to create a web OS framework that anyone can use. 

# Why Dojo?
While it seems the community has long forgotten Dojo, it remains a prominent framework for GIS applications. Therefore, developing this website using the Dojo framework, will help keep me current in my career. 

# Dependencies
[Dojo 1.15](https://dojotoolkit.org)

[dgrid](https://dgrid.io/)

[dstore](https://dstorejs.io/)

# Download and Installation
Clone / Download repository or download dependencies manually. 

## Recommended file structure
    
    dgrid
    dijit
    dojo
    dojox
    dstore
    markos
        - Widgit
            - css
            - images
            - templates
        - Widgit.js
        - markos.css
        - system.json

## Setup
Include the following script in index.html to map the markos and dojo local installations. 

    <script>
        // Imports all CSS for markOS
        @import "markos/markos.css";

        // References the local instalation of the dependencies and markos root folder.
        // Assumes you followed recommended file structure. 
        var dojoConfig = {
            async: true,
            baseUrl: '.',
            packages: [
                'dojo',
                'dijit',
                'dojox',
                'dgrid',
                'dstore',
                'markos'
            ]
        };
    </script>

Use the following script to instantiate markos

    <script>
        require([
            'markos/Desktop',
            'dojo/dom',
            'dojo/domReady!',
        ], function (
            Desktop,
            dom
        ) {
            var desktop = new Desktop();
            desktop.placeAt(document.body);
            desktop.startup();
        });
    </script>


# Getting Started (Coming Soon)
Tutorial for creating your first markos.
 
Explanation of the the Desktop module with the system.json.

How it works now (localStorage) and why (no server) and that it could be used 
with a server

# Widgets
[Desktop](https://github.com/mebuie/mebuie.github.io/tree/master/markos/Desktop) : The core module for markos.

[Clock](https://github.com/mebuie/mebuie.github.io/tree/master/markos/Clock) : Every OS needs a clock. Creates a system clock in the hotbar.  

[FileManager](https://github.com/mebuie/mebuie.github.io/tree/master/markos/FileManager) : Provides a user interface to manage files and folders
    
# Creating Software (Coming Soon)
Creating widgets in MarkOS is similar to [creating templated-based widgets](https://dojotoolkit.org/documentation/tutorials/1.10/templated/) in Dojo. The following template can be used to help you get started. 

        define([
            "dijit/_WidgetBase",
            "dijit/_TemplatedMixin",
            "dojo/text!./FileManager/templates/FileManager.html",
            "markos/_SoftwareContainer",
            "require",
            "dojo/domReady!"
        ], function(_WidgetBase, _TemplatedMixin, template, _SoftwareContainer, require) {

            return declare([_SoftwareContainer, _WidgetBase, _TemplatedMixin], {

                // For _SoftwareContainer; Merges this template into the _SotwareContainer template.
                softwareBodyTemplate: template,
                baseClass: "markos-<widget name>",

                postCreate: function () {
                    // Run any parent postCreate processes - can be done at any point
                    this.inherited(arguments);
                },

                startup: function() {                
                    // Run any parent postCreate processes - can be done at any point
                    this.inherited(arguments); 
                }

            });

        });

Note the addition of the SoftwareContainer module in the above widget template. This module is the key to creating MarkOS applications.

## SoftwareContainer module

The SoftwareContainer module provides a consistent user interference for MarkOS software, as well as common functionality such as maximize, minimize, and movability operations.

### Anatomy of SoftwareContainer
![match](https://github.com/mebuie/mebuie.github.io/blob/master/img/github/Anatomy_SoftwareContainer.png)

Note that close button calls this.destroyRecursive() on the SoftwareContainer. 

### Adding content to SoftwareContainer
The SoftwareContainer user interface contains two sections that are extendable. The header and the body.

- The header is generally used to display descriptive information, such as the app name or file location. 
- The body is the container for your custom widget. 

Content can be added to the header and body using the data-dojo-attach-point softwareContainerHeaderNode and softwareContainerBodyNode
In addition, any template passed to the softwareBodyTemplate property will be added to the SoftwareContainer body. This is the preferred way for adding content, as it ensures that variable substitutions, attach points, and event attachments are honored.  


Go over file structure and how js, html, css should be named the same thing

Go over system.json and uri should match widget name. 

CSS should start with baseClass to provide isolation. 

Need to discuss how you can FileViewer works. What arguments are required. 
How you can embed iframes using attachepoints. 
