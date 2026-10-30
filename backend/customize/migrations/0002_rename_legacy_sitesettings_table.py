from django.db import migrations


def rename_legacy_table(apps, schema_editor):
    connection = schema_editor.connection
    existing_tables = set(connection.introspection.table_names())
    old_table = "customize_sitesettings"
    new_table = "customize_sitesetting"

    if old_table in existing_tables and new_table not in existing_tables:
        model = apps.get_model("customize", "SiteSetting")
        schema_editor.alter_db_table(model, old_table, new_table)
    elif old_table in existing_tables and new_table in existing_tables:
        raise RuntimeError(
            "Both legacy and current SiteSetting tables exist; refusing to "
            "choose which delivery fee data to keep."
        )


def reverse_rename_legacy_table(apps, schema_editor):
    connection = schema_editor.connection
    existing_tables = set(connection.introspection.table_names())
    old_table = "customize_sitesetting"
    new_table = "customize_sitesettings"

    if old_table in existing_tables and new_table not in existing_tables:
        model = apps.get_model("customize", "SiteSetting")
        schema_editor.alter_db_table(model, old_table, new_table)
    elif old_table in existing_tables and new_table in existing_tables:
        raise RuntimeError(
            "Both current and legacy SiteSetting tables exist; refusing to "
            "choose which delivery fee data to keep."
        )


class Migration(migrations.Migration):
    dependencies = [
        ("customize", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(rename_legacy_table, reverse_rename_legacy_table),
    ]
