'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster get-kubeconfig',
    desc: {
        zh: '返回包含当前登录用户身份信息的Kubernetes集群访问kubeconfig',
        en: `Return to the Kubernetes cluster containing the identity information of the currently logged in user to access kubeconfig`
    },
    options: {
        'private-ip-address': {
            mapping: 'privateIpAddress',
            vtype: 'boolean',
            desc: {
                zh: '当前用户对应的集群访问kubeconfig',
                en: `The cluster corresponding to the current user accesses kubeconfig`
            }
        }
    },
    args: [
        {
            name: 'clusterId',
            required: true
        }
    ]
};

exports.run = async function (argv) {
    let profile = await runtime.getConfigOption();
    let { Config } = require('@alicloud/openapi-client');
    let config = new Config({
        accessKeyId: profile.access_key_id,
        accessKeySecret: profile.access_key_secret,
        securityToken: profile.sts_token,
        regionId: profile.region,
        type: profile.type
    });
    let DescribeClusterUserKubeconfigRequest = require(`@alicloud/cs20151215`).DescribeClusterUserKubeconfigRequest;
    let request = new DescribeClusterUserKubeconfigRequest(argv._mappingValue);

    let client = new Client(config);
    let result;
    try {
        result = await client.describeClusterUserKubeconfigWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    if (result) {
        result = result.body;
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};