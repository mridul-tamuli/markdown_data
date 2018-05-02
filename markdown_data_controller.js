import marked from '../../../src/forked/marked';
import angular from 'angular';
import $ from 'jquery';
import { uiModules } from 'ui/modules';
import 'angular-sanitize';
import { FilterBarQueryFilterProvider } from 'ui/filter_bar/query_filter';

import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';

marked.setOptions({
  gfm: true, // Github-flavored markdown
  sanitize: true // Sanitize HTML tags
});


const module = uiModules.get('kibana/markdown_data', ['kibana', 'ngSanitize', 'elasticsearch']);
module.controller('KbnMarkdownDataController', function ($scope, $rootScope, $element, $route, Private, $injector, $http) {
  const tabifyAggResponse = Private(AggResponseTabifyProvider);

  $scope.requiredColumns = [];
  
  $scope.getDefaultDownloadQuery = function() {
    return {
      "_source": $scope.requiredColumns,
      "query": {
        "bool": {
          "must": [
            {
              "match_all": {}
            }
          ]
        }
      },
      "size": 1
    };
  };
  $scope.getUserSearchRequest = function(query) {
    var esIndex = $scope.$parent.vis.indexPattern.title;
    var request = {
      method: 'GET',
      url: '/elasticsearch/' + esIndex + '/_search?source=' + angular.toJson(query),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    return $http(request);
  };
  
  $scope.$watchMulti(['esResponse', 'vis.params.markdown_data'], function ([resp]) {
    var html = $scope.vis.params.markdown_data;
    const filterBar = Private(FilterBarQueryFilterProvider);
    if (html) {
      var columns = [];
      var matches = html.match(/{{\s*[\w\.]+\s*}}/g);
      if (matches !== null) {
        columns = matches.map(function(x) { return x.match(/[\w\.]+/)[0]; });
      }
      //console.log('Filters', filterBar.getFilters());
      $scope.filters = filterBar.getFilters();
      $scope.requiredColumns = columns;
      
      var qry = $scope.getDefaultDownloadQuery();
      angular.forEach($scope.filters, function(v, k) {
        var filter = {
          "match_phrase": {}
        };
        angular.forEach(v.query.match, function(val, key) {
          filter.match_phrase[key] = {
            "query": val.query
          };
        });
        qry.query.bool.must.push(filter);
      });
      $scope.getUserSearchRequest(qry).then(function(response) {
        if (response.status === 200) {
          angular.forEach(response.data.hits.hits, function(item, k) {
            angular.forEach(item._source, function(value, field) {
              html = html.replace("{{" + field + "}}", value);
            });
          });
          $scope.html = marked(html);
        }
      }).catch(function () {
        console.log('Failed');
      });
    }
    $element.trigger('renderComplete');
  });
});
