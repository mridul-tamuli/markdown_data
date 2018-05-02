import 'plugins/markdown_data/markdown_data.less';
import 'plugins/markdown_data/markdown_data_controller';
import { VisVisTypeProvider } from 'ui/vis/vis_type';
import { TemplateVisTypeProvider } from 'ui/template_vis_type/template_vis_type';
import markdownDataTemplate from 'plugins/markdown_data/markdown_data.html';
import markdownDataParamsTemplate from 'plugins/markdown_data/markdown_data_params.html';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import image from './images/icon-markdown.svg';
import { VisSchemasProvider } from 'ui/vis/schemas';
//import 'ui/directives/saved_object_finder';
//import 'ui/directives/paginated_selectable_list';
//import { SavedObjectsClientProvider } from 'ui/saved_objects';

//import { AggResponseIndexProvider } from 'ui/agg_response/index';
// we need to load the css ourselves

// we also need to load the controller and used by the template

// register the provider with the visTypes registry so that other know it exists
VisTypesRegistryProvider.register(MarkdownDataProvider);

function MarkdownDataProvider(Private) {
  const VisType = Private(VisVisTypeProvider);
  const TemplateVisType = Private(TemplateVisTypeProvider);
  const Schemas = Private(VisSchemasProvider);

  // return the visType object, which kibana will use to display and configure new
  // Vis object of this type.
  return new TemplateVisType({
    name: 'markdown-data',
    title: 'Markdown with Data',
    image,
    description: 'Create a visualization using markdown syntax and multiple field values from Elasticsearch. It uses the dashboard query to retrieve data and display information from the first record only.',
    category: VisType.CATEGORY.DATA,
    template: markdownDataTemplate,
    params: {
      defaults: {
        allDetails:true
      },
      editor: markdownDataParamsTemplate
    },
    implementsRenderComplete: true,
  });
}
//implementsRenderComplete: true,
//requiresSearch: false,
// export the provider so that the visType can be required with Private()
export default MarkdownDataProvider;