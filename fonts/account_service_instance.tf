resource "aws_opsworks_instance" "account_service_instance" {
  stack_id = "${var.platform_stack_id}"

  layer_ids = [
    "${module.platform_account_service_opsworks_layer.opsworks_layer_id}",
  ]

  instance_type = "${var.account_service_instance_type}"
  os            = "Custom"
  ami_id        = "${lookup(var.ubuntu, var.aws_region)}"
  state         = "running"

  subnet_id = "${element(var.platform_subnet_ids, count.index)}"
  count     = "${var.account_service_instance_count}"
  hostname  = "account-service${count.index + 1}"
}

resource "aws_opsworks_instance" "account_service_loadbased_instance" {
  stack_id = "${var.platform_stack_id}"

  layer_ids = [
    "${module.platform_account_service_opsworks_layer.opsworks_layer_id}",
  ]

  instance_type     = "${var.account_service_instance_type}"
  os                = "Custom"
  ami_id            = "${lookup(var.ubuntu, var.aws_region)}"
  state             = "stopped"
  auto_scaling_type = "load"
  subnet_id         = "${element(var.platform_subnet_ids, count.index)}"
  count             = "${var.account_service_loadbased_instance_count}"
  hostname          = "account-service-loadbased${count.index + 1}"
}
