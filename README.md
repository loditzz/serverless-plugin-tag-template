# serverless-plugin-tag-template

Tags are very useful, specially for billing. This plugin will create a custom tag key and the value will be the resources name.
Cloudformation already creates some automatic tags for resources, but these tags can't be used in resources created dinamicly. With this plugin you can have a tag that can be shared with all your resources.

## Installing

    npm install serverless-plugin-tag-template
## serverless.yml   
  
    custom:
      customTagKey: "Tag key"
    plugins:
      - serverless-plugin-tag-template