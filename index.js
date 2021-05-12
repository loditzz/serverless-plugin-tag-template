
class ServerlessPlugin {
	constructor(serverless, options) {
		this.serverless = serverless;
		this.options = options || {};
		this.provider = serverless ? serverless.getProvider("aws") : null;
		this.service = serverless.service;
		this.stage = null;
		this.region = null;
		this.awsService = this.serverless.getProvider("aws");
		this.isApiGatewayStageAvailableInTemplate = false;
		this.supportedTypes = ["AWS::Lambda::Function", "AWS::SQS::Queue", "AWS::DynamoDB::Table", "AWS::S3::Bucket"]; // add new types here

		if (!this.provider) {
			throw new Error("This plugin must be used with AWS");
		}

		this.hooks = {
			"after:aws:package:finalize:mergeCustomProviderResources": this.addTagsToCFTemplate.bind(this),
		};
	}
  
	addTagsToCFTemplate() {
		const self = this;
		const template = this.serverless.service.provider.compiledCloudFormationTemplate;
		const Key = this.serverless.service.custom.customTagKey;
		self.serverless.cli.log(`STARTED TAGS UPDATE`);

		this.stage = this.serverless.service.provider.stage;
		if (this.options.stage) {
			this.stage = this.options.stage;
		}

		this.region = this.serverless.service.provider.region;
		if (this.options.region) {
			this.region = this.options.region;
		}

		Object.keys(template.Resources).forEach(function (resource) {
			const resourceType = template.Resources[resource].Type;

			if (self.supportedTypes.indexOf(resourceType) !== -1) {
				if (template.Resources[resource].Properties) {
					const existingTags = template.Resources[resource].Properties.Tags;
					const newTags = [{ Key, Value: resource }];
					template.Resources[resource].Properties.Tags = existingTags ? existingTags.concat(newTags) : newTags;
				} else {
					self.serverless.cli.log(`Properties not available for ${resourceType}`);
				}
			}
		});
		self.serverless.cli.log("Updated AWS resource tags..");
	}
}
  
  module.exports = ServerlessPlugin;
  