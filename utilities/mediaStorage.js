const contentfulManagement = require('contentful-management');
const contentful = require('contentful');

const uploadFile = (title, description, contentType, fileName, file) => {
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_CONTENT_MANAGEMENT_API_KEY,
  });
  return client
    .getSpace(process.env.CONTENTFUL_SPACE_ID)

    .then((space) =>
      space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID)
    )

    .then((environment) =>
      environment.createAssetFromFiles({
        fields: {
          title: {
            'en-US': title,
          },
          description: {
            'en-US': description,
          },
          file: {
            'en-US': {
              contentType: contentType,
              fileName: fileName,
              file: file,
            },
          },
        },
      })
    )
    .then((asset) => asset.processForAllLocales())
    .then((asset) => asset.publish())
    .then((asset) => asset.sys.id)
    .catch((err) => {
      console.log(err);
      throw new Error('cannot save file');
    });
};

const getFileURL = (assetId) => {
  console.log(process.env);
  console.log(
    'xrv8pfvkz732',
    process.env.CONTENTFUL_SPACE_ID,
    'OaC96xvnWJ5jKnPP73pojl1XIG47T6p7OmzFBo0ZAdg',
    process.env.CONTENTFUL_ACCESS_TOKEN,
    'preview.contentful.com',
    process.env.CONTENTFUL_HOST
  );

  const client = contentful.createClient({
    // space: process.env.CONTENTFUL_SPACE_ID,
    // accessToken: 'OaC96xvnWJ5jKnPP73pojl1XIG47T6p7OmzFBo0ZAdg',
    // host: process.env.CONTENTFUL_HOST,
    space: 'xrv8pfvkz732',
    accessToken: 'OaC96xvnWJ5jKnPP73pojl1XIG47T6p7OmzFBo0ZAdg',
    host: 'preview.contentful.com',
  });

  return client
    .getAsset(assetId)
    .then((asset) => {
      console.log('https:' + asset.fields.file.url);
      return 'https:' + asset.fields.file.url;
    })
    .catch(console.error);
};

const deleteFile = (assetId) => {
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_CONTENT_MANAGEMENT_API_KEY,
  });

  client
    .getSpace(process.env.CONTENTFUL_SPACE_ID)
    .then((space) =>
      space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID)
    )
    .then((environment) => {
      // console.log(environment);
      return environment.getAsset(assetId);
    })
    // .then((environment) => environment.getUpload('<upload_id>'))
    .then(async (asset) => {
      // console.log(asset);
      await asset.unpublish();
      // console.log(asset);
      return asset.delete();
    })
    .then(() => console.log('File deleted.'))
    .catch(console.error);
};

module.exports = { uploadFile, getFileURL, deleteFile };
